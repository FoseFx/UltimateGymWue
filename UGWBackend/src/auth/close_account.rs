use crate::responses::CustomResponse;
use crate::auth::guards::AuthGuard;
use rocket::State;
use crate::DBURL;
use crate::SecretMgt;
use std::ops::Deref;
use crate::db;

#[delete("/auth/closeAccount")]
pub fn remove_account(user: AuthGuard, secret: State<SecretMgt>, db_url: State<DBURL>) -> CustomResponse {
    let db_url = &db_url.url;
    let secret: &String = &secret.0.deref().to_string();
    let uid = user.claim.uid;

    let remove_response = db::remove_user_account(&uid, secret, db_url);

    return CustomResponse::message("Ok, Account wurde gelöscht".to_string());
}