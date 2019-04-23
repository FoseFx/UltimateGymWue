use crate::{InstaSecretMgt, SecretMgt};
use rocket::State;
use rocket_contrib::json::Json;
use crate::responses::CustomResponse;
use std::collections::hash_map::HashMap;
use crate::auth::insta::register::InstaAuthResponse;
use reqwest::Error;
use std::ops::Deref;
use rocket::http::Status;

#[derive(Deserialize, Serialize)]
#[derive(Debug)]
pub struct InstaLoginCodeRequest{
    code: String,
    href: String,
}


#[post("/auth/insta/login", data="<data>")]
pub fn login_instagram_handler(data: Json<InstaLoginCodeRequest>,
                               insta_secrets: State<InstaSecretMgt>,
                               secret: State<SecretMgt>) -> CustomResponse {

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


    let claim_res = crate::db::login_insta(iid, secret);

    if claim_res.is_err() {
        println!("error fetching claim {:?}", &claim_res);
        return CustomResponse::error(claim_res.unwrap_err(), rocket::http::Status::Unauthorized);
    }

    let claim = claim_res.unwrap();

    let token = jsonwebtoken::encode(&jsonwebtoken::Header::default(), &claim, secret.as_ref()).unwrap();

    return CustomResponse::data(json!({
        "claim": claim,
        "token": token
    }));

}

