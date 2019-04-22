use rocket_contrib::json::Json;
use crate::responses::CustomResponse;
use rocket::State;
use crate::{SecretMgt, GOOGLE_AUD};
use crate::auth::google::register::handler::GoogleUser;
use reqwest::Response;
use std::ops::Deref;
use std::error::Error;
use rocket::http::Status;

#[derive(Deserialize, Serialize)]
#[derive(Debug)]
pub struct GoogleLoginRequest {
    token: String
}
#[post("/auth/google/login", data = "<data>")]
pub fn google_login_handler(data: Json<GoogleLoginRequest>, secret: State<SecretMgt>) -> CustomResponse {

    let secret: String = secret.0.deref().to_string();
    let token = &data.token;


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

    if !google_resp.aud.contains(GOOGLE_AUD) {
        return CustomResponse::error(
            "Das Token gehört zu einer anderen App und kann nicht für UGW verwendet werden.".to_string(),
            Status::Unauthorized
        );
    }


    let claim = crate::db::get_google_login_data(&google_resp.sub, &secret);

    println!("claim: {:#?}", &claim);

    if claim.is_err() {
        return CustomResponse::error(
            "Nutzer nicht gefunden".to_string(),
            rocket::http::Status::Unauthorized
        );
    }

    let claim = claim.unwrap();

    let token = jsonwebtoken::encode(&jsonwebtoken::Header::default(), &claim, secret.as_ref()).unwrap();


    return CustomResponse::data(json!({
        "claim": claim,
        "token": token
    }));

}