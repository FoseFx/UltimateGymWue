use crate::auth::guards::AuthGuard;
use crate::basics::utils::Kurs;
use rocket::State;
use crate::SecretMgt;
use rocket_contrib::json::Json;
use crate::responses::CustomResponse;
use rocket::http::Status;
use std::ops::Deref;
use crate::DBURL;

#[derive(Deserialize,Serialize)]
#[derive(Debug)]
pub struct SetBasicsRequest {
    kurse: Vec<Kurs>,
    stufe: String
}

#[put("/basics", data="<data>")]
pub fn set_basics(user: AuthGuard, secret: State<SecretMgt>, data: Json<SetBasicsRequest>, db_url: State<DBURL>) -> CustomResponse {
    let db_url = &db_url.url;
    let kurse: &Vec<Kurs> = &data.kurse;
    let stufe: &String = &data.stufe;

    let uid = user.claim.uid;

    let client = reqwest::Client::new();
    let jsonv = json!({
        "uid": uid,
        "kurse": kurse,
        "stufe": stufe
    });
    println!("{:?}", &jsonv);
    let json_res = serde_json::to_string(&jsonv).unwrap();
    let base = base64::encode(&json_res);
    let res = client.get(&format!("{}set_basics/{}", db_url, base)[..])
        .header(reqwest::header::AUTHORIZATION, secret.0.deref().to_string())
        .send();
    if res.is_err() {
        return CustomResponse::error(res.unwrap_err().to_string(), Status::InternalServerError);
    }
    let res = res.unwrap();
    let res = res.error_for_status();
    if res.is_err() {
        return CustomResponse::error(res.unwrap_err().to_string(), Status::InternalServerError);
    }

    return CustomResponse::message("Ok".to_string());
}

