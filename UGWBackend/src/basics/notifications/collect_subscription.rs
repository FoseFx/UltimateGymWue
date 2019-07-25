use crate::auth::guards::AuthGuard;
use rocket::State;
use crate::{SecretMgt, DBURL};
use rocket_contrib::json::Json;
use crate::responses::CustomResponse;
use crate::rocket::http::Status;

#[derive(Deserialize,Serialize,Debug)]
pub struct AddSubscriptionRequest {
    pub endpoint: String,
    pub keys: PushSubscriptionKeys
}

#[derive(Deserialize,Serialize,Debug)]
pub struct PushSubscriptionKeys {
    pub p256dh: String,
    pub auth: String
}


#[post("/basics/notifications/subscribe", data="<data>")]
pub fn add_subscription_handler(user: AuthGuard,
                            secret: State<SecretMgt>,
                            data: Json<AddSubscriptionRequest>,
                            db_url: State<DBURL>) -> CustomResponse {

    let data = data.0;
    let user_id = user.claim.uid;
    let db_res = add_to_db(&user_id, &data, &secret.0, &db_url.url);
    if db_res.is_err() {
        return CustomResponse::error("Serverfehler".to_string(), Status::InternalServerError);
    }
    return CustomResponse::message("Ok".to_string());
}

fn add_to_db(uid: &String, sub: &AddSubscriptionRequest, secret: &String, db_url: &String) -> Result<bool, String> {
    let as_json = json!({"sub": sub, "uid": uid});
    let as_string = serde_json::to_string(&as_json);
    if as_string.is_err() {
        return Err("Could not Serialize data".to_string());
    }
    let as_string = as_string.unwrap();
    let base = base64::encode(&as_string);
    let client = reqwest::Client::new();
    let res = client.get(&format!("{}newPushSub/{}", db_url, base)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }
    return Ok(true);
}