use crate::auth::guards::AuthGuard;
use crate::{DBURL, SecretMgt};
use rocket::State;
use crate::redismw::RedisConnection;
use crate::basics::guards::HasCredsGuard;
use crate::responses::CustomResponse;
use rocket::http::Status;
use crate::basics::kurse::{is_stufe, stufe_to_id};
use std::ops::Deref;
use std::collections::HashMap;
use rocket_contrib::json::JsonValue;
use crate::CustomError;
use serde_json::Map;
use crate::basics::utils::BasicCredsWrapper;
use redis::RedisResult;
use crate::redis::Commands;

#[get("/basics/vp/<stufe>")]
pub fn get_vertretungsplan(_user: AuthGuard,
                           creds: HasCredsGuard,
                           redis: RedisConnection,
                           secret: State<SecretMgt>,
                           db_url: State<DBURL>,
                           stufe: String) -> CustomResponse {

    let db_url = &db_url.url;
    let redis_conn = redis.0.deref();
    let schueler_creds = &creds.pl.schueler;
    let secret: &String = &secret.0.deref().to_string();

    if !is_stufe(&stufe) { // tested by regex
        return CustomResponse::error(format!("Scheint keine Stufe zu sein"), Status::BadRequest);
    }
    let stufe_id = stufe_to_id(redis_conn, schueler_creds, &stufe, secret, db_url);

    if stufe_id.is_none() { // stufe not found
        return CustomResponse::error(format!("Stufe nicht gefunden"), Status::BadRequest);
    }

    let result = get_the_vertretungsplan(&db_url, schueler_creds, secret, redis_conn);

    if result.is_err() {
        println!("{:#?}", &result);
        return CustomResponse::error(format!("{:?}", result), Status::BadRequest);
    }
    let result = result.unwrap();

    let infos: &serde_json::Value = result.get(0).unwrap();

    let map: &Map<String, serde_json::Value> = result.get(1).unwrap().as_object().unwrap();

    let stufe_vp_datum = map.get(&stufe);

    if stufe_vp_datum.is_none() {
        return CustomResponse::data(json!({"infos": infos}));
    }

    return CustomResponse::data(json!({"infos": infos, "vp": stufe_vp_datum.unwrap()}));
}

fn get_the_vertretungsplan(db_url: &String, schueler_creds: &BasicCredsWrapper, secret: &String, redis: &redis::Connection) -> Result<Vec<JsonValue>, Box<std::error::Error>> {

    let redis_get_res: RedisResult<String> = redis.get("vertretungsplan");

    if redis_get_res.is_ok() {
        let json = serde_json::from_str(&redis_get_res.unwrap()[..])?;
        return Ok(json);
    }

    let client = reqwest::Client::new();

    let resp = client
        .get(
            &format!("{}vp/{}", db_url, base64::encode(&format!("{}:{}", schueler_creds.username, schueler_creds.password)))[..]
        )
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();

    if resp.is_err() {
        error!(format!("{:?}", resp))
    }

    let result: Result<Vec<JsonValue>, reqwest::Error>  = resp.unwrap().json();


    if result.is_err() {
        error!(format!("{:?}", result));
    }
    let result = result.unwrap();

    let txt = serde_json::to_string(&json!(result))?;
    let _res: RedisResult<String> = redis.set_ex("vertretungsplan", txt, 60 * 5);

    return Ok(result);


}
#[derive(Deserialize,Serialize,Debug)]
struct VertretungsDatum {
    typ: String,
    date: String,
    fach: String,
    info: String,
    newRaum: String,
    oldRaum: String,
    stunde: String
}