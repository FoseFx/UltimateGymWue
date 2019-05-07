use rocket::http::Status;
use crate::responses::CustomResponse;
use crate::basics::guards::HasCredsGuard;
use crate::auth::guards::AuthGuard;
use crate::redismw::RedisConnection;
use std::error::Error;
use crate::basics::utils::Kurs;
use crate::SecretMgt;
use rocket::State;

#[get("/basics/stundenplan")]
pub fn get_sp(user: AuthGuard, _creds: HasCredsGuard, _redis: RedisConnection, secret: State<SecretMgt>) -> CustomResponse {

    let kurse = get_users_kurse(secret.0.to_string(), user.claim.uid);
    if kurse.is_err() {
        let err = kurse.unwrap_err().to_string();
        if err.contains("402 Payment Required") {
            return CustomResponse::error("Kurse nicht gesetzt".to_string(), Status::BadRequest);
        } else if err.contains("401 Unauthorized"){
            return CustomResponse::error("Nutzer nicht gefunden".to_string(), Status::BadRequest);
        }
        return CustomResponse::error(err, Status::BadRequest);
    }
    let kurse = kurse.unwrap();

    // todo get stundenplan

    // todo generate personal sp

    return CustomResponse::data(json!(kurse));
    // return CustomResponse::error("Not Implemented yet".to_string(), Status::NotImplemented);
}

fn get_users_kurse(secret: String, uid: String) -> Result<Vec<Kurs>, Box<Error>> {
    let client = reqwest::Client::new();

    let res = client
        .get(&format!("http://localhost:8080/users_kurse/{}", uid)[..])
        .header(reqwest::header::AUTHORIZATION, secret)
        .send()?;
    let mut res = res.error_for_status()?;
    let kurse: Vec<Kurs> = res.json()?;
    return Ok(kurse);
}


fn get_stundenplan() -> Result<serde_json::Value, Box<Error>> {

    return Ok(json!("ok"));
}