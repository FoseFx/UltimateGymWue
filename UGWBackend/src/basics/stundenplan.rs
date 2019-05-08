use rocket::http::Status;
use crate::responses::CustomResponse;
use crate::basics::guards::HasCredsGuard;
use crate::auth::guards::AuthGuard;
use crate::redismw::RedisConnection;
use std::error::Error;
use crate::basics::utils::{Kurs, BasicCredsWrapper, TTWoche};
use crate::{SecretMgt, CustomError};
use rocket::State;
use std::ops::Deref;
use crate::basics::kurse::{stufe_to_id, get_wochen, fetch_kurse_and_tt};
use redis::RedisResult;
use crate::redis::Commands;

#[get("/basics/stundenplan")]
pub fn get_sp(user: AuthGuard, creds: HasCredsGuard, redis: RedisConnection, secret: State<SecretMgt>) -> CustomResponse {

    let redis = redis.0.deref();
    let creds = creds.pl.schueler;
    let secret: String = secret.0.deref().to_string();

    let kurse = get_users_kurse(&secret, user.claim.uid);
    if kurse.is_err() {
        let err = kurse.unwrap_err().to_string();
        if err.contains("402 Payment Required") {
            return CustomResponse::error("Kurse nicht gesetzt".to_string(), Status::BadRequest);
        } else if err.contains("401 Unauthorized"){
            return CustomResponse::error("Nutzer nicht gefunden".to_string(), Status::BadRequest);
        }
        return CustomResponse::error(err, Status::BadRequest);
    }
    let (stufe, kurse) = kurse.unwrap();

    let sp = get_stundenplan(redis, creds, &secret, stufe);
    if sp.is_err() {
        return CustomResponse::error(sp.unwrap_err().to_string(), Status::BadRequest);
    }
    let sp = sp.unwrap();
    // todo generate personal sp

    return CustomResponse::data(json!({"kurse":kurse, "sp": sp}));
    // return CustomResponse::error("Not Implemented yet".to_string(), Status::NotImplemented);
}

fn get_users_kurse(secret: &String, uid: String) -> Result<(String, Vec<Kurs>), Box<Error>> {
    let client = reqwest::Client::new();

    let res = client
        .get(&format!("http://localhost:8080/users_kurse/{}", uid)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send()?;
    let mut res = res.error_for_status()?;
    let res: serde_json::Value = res.json()?;


    let stufe = res.get("stufe");
    if stufe.is_none() {
        error!("stufe not found");
    }
    let stufe = stufe.unwrap().as_str().unwrap().to_string();
    let kurse = res.get("kurse");
    if kurse.is_none() {
        error!("kurse not found");
    }
    let kurse = kurse.unwrap();
    let kurse: Vec<Kurs> = serde_json::from_str(serde_json::to_string(kurse)?.as_str())?;

    return Ok((stufe, kurse));
}


fn get_stundenplan(redis_conn: &redis::Connection, schueler_creds: BasicCredsWrapper, secret: &String, stufe: String) -> Result<Vec<TTWoche>, Box<Error>> {

    //
    let stufe_id = stufe_to_id(redis_conn, &schueler_creds, &stufe);
    if stufe_id.is_none() {
        error!("stufe not found");
    }
    let stufe_id = stufe_id.unwrap();

    let key = format!("kurse_{}", &stufe_id);
    let tt_key = format!("tt_{}", &stufe_id);
    let cached: RedisResult<String> = redis_conn.get(&tt_key); // will fail, when nil
    if cached.is_ok() {
        return Ok(serde_json::from_str(cached.unwrap().as_ref())?);
    }

    let wochen = get_wochen(redis_conn, &schueler_creds);
    if wochen.is_err() {
        let err = wochen.unwrap_err();
        println!("error while getting wochen: {:#?}", &err);
        error!(format!("{:?}", err))
    }
    let wochen = wochen.unwrap();


    let kurse_and_tt = fetch_kurse_and_tt(schueler_creds, secret, &stufe, &stufe_id, &wochen)?;
    let kurse = kurse_and_tt.kurse;
    let tt = kurse_and_tt.tt;

    let kurse_str = serde_json::to_string(&kurse)?;
    let tt_str = serde_json::to_string(&tt)?;
    let _: RedisResult<u8> = redis_conn.set_ex(key, kurse_str, 8 * 60 * 60);
    let _: RedisResult<u8> = redis_conn.set_ex(tt_key, tt_str, 8 * 60 * 60);

    return Ok(tt);
}