use rocket_contrib::json::Json;
use crate::responses::CustomResponse;
use rocket::http::Status;
use reqwest::Response;
use std::error::Error;
use crate::{GOOGLE_AUD, SecretMgt};
use rocket::State;
use std::ops::Deref;
use crate::DBURL;

#[derive(Deserialize)]
#[derive(Debug)]
pub struct GoogleRegisterRequest {
    fullname: String,
    token: String
}

#[post("/auth/google/register", data = "<data>")]
pub fn google_register_handler(data: Json<GoogleRegisterRequest>, secret: State<SecretMgt>, db_url: State<DBURL>) -> CustomResponse {

    let db_url = &db_url.url;
    let secret: String = secret.0.deref().to_string();
    let token = &data.token;
    let fullname = &data.fullname;
    let fullname = fullname.to_owned();

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

    println!("{:#?}", &google_resp); // todo rm this


    // google account exists?

    let g_exists_res = crate::db::exists_google_account(&google_resp.sub, &secret, db_url);
    if g_exists_res.is_err() {
        println!("FATAL ERROR CHECKING G ACCOUNT: {:?}", g_exists_res.unwrap_err());
        return CustomResponse::error(format!("Server Error"), Status::InternalServerError);
    }
    let g_exists_res = g_exists_res.unwrap();
    if g_exists_res {
        return CustomResponse::error(format!("Google Account wird bereits benutzt."), Status::Unauthorized);
    }

    // no



    // email exists?
    let exists_res = crate::db::exists_email(&google_resp.email, &secret, db_url);
    if exists_res.is_err() {
        println!("{:?}", exists_res.unwrap_err());
        return CustomResponse::error(format!("Server Error"), Status::InternalServerError);
    }
    let exists_res = exists_res.unwrap();
    if exists_res {
        return CustomResponse::error(format!("Email benutzt"), Status::Unauthorized);
    }

    // no

    // Add to DB

    let add_user_resp = crate::db::add_user(
        crate::db::User {
            fullname,
            normal: None,
            google: Some(crate::db::GoogleLoginData {
                email: google_resp.email,
                gid: google_resp.sub
            }),
            instagram: None
        },
        secret,
        db_url
    );

    if add_user_resp.is_err() {
        let err = add_user_resp.unwrap_err();
        println!("FATAL ERROR ADDING USER TO DB: {:?}", err);
        return CustomResponse::error(
            "Fehler bei Kommunikation mit Datenbank.".to_string(),
            Status::InternalServerError
        );
    }


    return CustomResponse::message("Ok".to_string());
}

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct GoogleUser {
    pub alg: String,
    pub at_hash: String,
    pub aud: String,
    pub azp: String,
    pub email: String,
    pub email_verified: String,
    pub exp: String,
    pub given_name: String,
    pub family_name: String,
    pub iat: String,
    pub iss: String,
    pub jti: String,
    pub kid: String,
    pub locale: String,
    pub name: String,
    pub picture: String,
    pub sub: String,
    pub typ: String
}