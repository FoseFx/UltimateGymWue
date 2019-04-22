use rocket::response::NamedFile;
use std::path::Path;
use rocket::http::Status;
use rocket_contrib::json::Json;
use crate::responses::CustomResponse;
use std::collections::HashMap;
use crate::{InstaSecretMgt, SecretMgt};
use rocket::State;
use reqwest::Error;
use std::ops::Deref;

#[get("/auth/insta/register-redirect")]
pub fn insta_register_handler() -> Option<NamedFile> {
    return NamedFile::open(Path::new("./insta-redirect.html")).ok();
}

#[derive(Deserialize, Serialize)]
#[derive(Debug)]
pub struct InstaRegisterCodeRequest{
    code: String,
    href: String,
    fullname: String
}

#[derive(Deserialize, Serialize)]
#[derive(Debug)]
pub struct InstaAuthResponse {
    pub error_type: Option<String>,
    pub error_message: Option<String>,
    pub code: Option<u16>,
    pub access_token: Option<String>,
    pub user: Option<InstaAuthUserResponse>
}

#[derive(Deserialize, Serialize)]
#[derive(Debug)]
pub struct InstaAuthUserResponse {
    pub bio: String,
    pub full_name: String,
    pub id: String,
    pub is_business: bool,
    pub profile_picture: String,
    pub username: String,
    pub website: String
}

#[post("/auth/insta/register-code", data="<data>")]
pub fn insta_register_code_handler(data: Json<InstaRegisterCodeRequest>,
                                   insta_secrets: State<InstaSecretMgt>, secret: State<SecretMgt>) -> CustomResponse {

    let secret = &secret.deref().0.to_string();
    let cid = &insta_secrets.client_id;
    let c_secret = &insta_secrets.client_secret;

    let mut form: HashMap<&'static str, String> = HashMap::new();

    form.insert("client_id", cid.to_owned());
    form.insert("client_secret", c_secret.to_owned());
    form.insert("grant_type", "authorization_code".to_string());
    form.insert("redirect_uri", data.href.to_owned());
    form.insert("code", data.code.to_owned());

    let client = reqwest::Client::new();

    let req_res = client
        .post("https://api.instagram.com/oauth/access_token")
        .form(&form)
        .send();

    if req_res.is_err() {
        println!("ERROR BUILDING REQUEST: {:?}", req_res.unwrap_err());
        return CustomResponse::error(
            "Anfrage an Instagram Server konnte nicht gemacht werden.".to_string(),
            Status::InternalServerError
        );
    }

    let mut res = req_res.unwrap();
    let res: Result<InstaAuthResponse, Error>  = res.json();

    if res.is_err() {
        println!("{:?}", res);
        return CustomResponse::error(
            "Fehler beim Parsen der Antwort der Instagram Server".to_string(),
            Status::InternalServerError
        );
    }

    let res = res.unwrap();

    if res.error_message.is_some() {
        println!("server send an error: {:?}", res);
        return CustomResponse::error(
            res.error_message.unwrap(),
            Status::BadRequest
        );
    }



    let user = res.user.unwrap();
    let iid = &user.id.to_string();

    let exists_res = crate::db::exists_insta_account(&iid, secret);
    if exists_res.is_err() {
        println!("FATAL ERROR CHECKING I ACCOUNT: {:?}", exists_res.unwrap_err());
        return CustomResponse::error(format!("Server Error"), Status::InternalServerError);
    }
    let exists = exists_res.unwrap();
    if exists {
        return CustomResponse::error(
            "Instagram Account bereits ist registriert".to_string(),
            Status::BadRequest
        );
    }


    let user = crate::db::User {
        fullname: data.fullname.to_owned(),
        google: None,
        normal: None,
        instagram: Some(crate::db::InstaLoginData {
            username: user.username,
            iid: user.id,
            token: res.access_token.unwrap()
        })
    };

    let add_res = crate::db::add_user(user, secret.to_string());

    if add_res.is_err() {
        println!("error adding user: {:?}", add_res);
        return CustomResponse::error(
            "Datebankverbindung fehlgeschlagen".to_string(),
            Status::InternalServerError
        );
    }

    return CustomResponse::message("Ok".to_string());
}