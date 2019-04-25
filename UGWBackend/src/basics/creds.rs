use rocket_contrib::json::Json;
use crate::auth::guards::AuthGuard;
use crate::redismw::RedisConnection;
use std::ops::Deref;
use crate::redis::Commands;
use crate::responses::CustomResponse;
use crate::basics::utils::{BasicCredsWrapper, BasicCreds};
use crate::SecretMgt;
use rocket::State;


#[derive(Deserialize,Serialize)]
#[derive(Debug)]
pub struct AddCredsRequest {
    lehrer: bool,
    username: String,
    password: String
}

#[post("/basics/add_creds", data="<data>")]
pub fn add_creds_handler(user: AuthGuard,
                         redis_conn: RedisConnection,
                         secret: State<SecretMgt>,
                         data: Json<AddCredsRequest>) -> CustomResponse {

    let secret: &String = &secret.0.deref().to_string();
    let conn: &redis::Connection = redis_conn.0.deref();
    let uid = user.claim.uid;

    let lehrer = data.lehrer;
    let username = data.username.to_string();
    let password = data.password.to_string();

    let basic_creds = BasicCredsWrapper {
        username: username.clone(),
        password: password.clone()
    };

    let is_cached = is_cached(&data, conn);
    if !is_cached {
        let res = match lehrer {
            true => super::stufen::fetch_navbar(basic_creds), // todo fetch sth else
            false => super::stufen::fetch_navbar(basic_creds)
        };
        if res.is_err() {
            println!("error testing creds {:?}", res);
            return CustomResponse::error(
                "Anmeldedaten vom Schulserver abgelehnt".to_string(),
                rocket::http::Status::Unauthorized
            );
        }
    }

    let cred_obj = match lehrer {
        false => BasicCreds {lehrer: None, schueler: BasicCredsWrapper {username: username.clone(), password: password.clone()}},
        true => BasicCreds {lehrer: Some(BasicCredsWrapper {username, password}), schueler: BasicCredsWrapper {username: "todo".to_string(), password: "todo".to_string() }}
    };
    println!("{:?}", crate::db::add_creds_to_user(&uid, &cred_obj, secret));

    let token = jsonwebtoken::encode(&jsonwebtoken::Header::default(), &cred_obj, secret.as_ref()).unwrap();

    return CustomResponse::message(token);


}
/// untested
fn is_cached(creds: &AddCredsRequest, conn: &redis::Connection) -> bool {
    let get_res: redis::RedisResult<String> = match creds.lehrer {
        false => conn.get("schueler_creds"),
        true => conn.get("lehrer_creds")
    }; // this will false on nil

    if get_res.is_err() {
        return false;
    }

    let str_concat = format!("{}:{}", creds.username, creds.password);

    return get_res.unwrap() == str_concat;
}
