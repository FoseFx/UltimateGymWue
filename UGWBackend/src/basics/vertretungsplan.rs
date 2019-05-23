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

    let client = reqwest::Client::new();

    let resp = client
        .get(
            &format!("{}vp/{}", &db_url, base64::encode(&format!("{}:{}", schueler_creds.username, schueler_creds.password)))[..]
            )
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();

    if resp.is_err() {
        return CustomResponse::error(format!("{:?}", resp), Status::BadRequest);
    }

    // todo

    let map: Result<Vec<HashMap<String, Vec<VertretungsDatum>>>, reqwest::Error>  = resp.unwrap().json();

    if map.is_err() {
        return CustomResponse::error(format!("{:?}", map), Status::InternalServerError);
    }
     let map = map.unwrap();


    return CustomResponse::data(json!(map));
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