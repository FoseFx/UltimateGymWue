use rocket_contrib::json::Json;
use crate::responses::CustomResponse;
use rocket::http::Status;
use reqwest::Response;
use std::error::Error;

#[derive(Deserialize)]
#[derive(Debug)]
pub struct GoogleRegisterRequest {
    fullname: String,
    token: String
}

#[post("/auth/google/register", data = "<data>")]
pub fn google_register_handler(data: Json<GoogleRegisterRequest>) -> CustomResponse {

    let token = &data.token;
    let fullname = &data.fullname;

    //
    // Let Google verify token
    //

    let google_resp: Result<Response, reqwest::Error> = reqwest::get(
        &format!("https://oauth2.googleapis.com/tokeninfo?id_token={}", token)
    );

    if google_resp.is_err() { // network errors, dns errors etc.
        let err = google_resp.unwrap_err();
        println!("FATAL: GOOGLE AUTH ERROR: {:?}", err);
        return CustomResponse::error(
            format!("Fehler bei der Verbindung zu den Google Servern: '{}'", err.description()),
            Status::ServiceUnavailable
        );
    }
    let google_resp = google_resp.unwrap().error_for_status();

    if google_resp.is_err() { // invalid status code
        let err = google_resp.unwrap_err();
        println!("GOOGLE AUTH ERROR: {:?}", err);
        return CustomResponse::error(
            format!("Die Google Server haben die Anfrage nicht Verifiziert"),
            Status::Unauthorized
        );
    }
    let google_resp: Result<GoogleUser, reqwest::Error> = google_resp.unwrap().json();

    if google_resp.is_err() { // invalid json response, should not happen
        let err = google_resp.unwrap_err();
        println!("FATAL: GOOGLE AUTH ERROR: {:?}", err);
        return CustomResponse::error(
            format!("Die Google Server haben nicht wie erwartet geantwortet"),
            Status::ServiceUnavailable
        );
    }
    let google_resp: GoogleUser = google_resp.unwrap();

    if google_resp.email_verified != "true" {
        return CustomResponse::error(
            "Du kannst UGW nur nutzen, wenn deine Email bei Google verifiziert wurde.".to_string(),
            Status::Unauthorized
        );
    }

    // todo google account exists

    // todo email exists

    // todo add to db


    println!("{:#?}", google_resp); // todo rm this


    return CustomResponse::message("Ok".to_string());
}

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct GoogleUser {
    alg: String,
    at_hash: String,
    aud: String,
    azp: String,
    email: String,
    email_verified: String,
    exp: String,
    given_name: String,
    family_name: String,
    iat: String,
    iss: String,
    jti: String,
    kid: String,
    locale: String,
    name: String,
    picture: String,
    sub: String,
    typ: String
}