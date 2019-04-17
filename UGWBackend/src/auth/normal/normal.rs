//
// Handler for "normal" (email/pwd) login
//
extern crate rand;
use super::passw;
use rocket_contrib::json::{Json};
use rocket::http::Status;
use super::super::regexes;
use crate::{SecretMgt, MailJetMgt};
use rocket::State;
use std::ops::Deref;
use crate::responses::CustomResponse;

#[derive(Deserialize)]
#[derive(Debug)]
pub struct NormalRegisterData {
    fullname: String,
    email: String,
    password: String
}

#[post("/auth/normal/register", data = "<data>")]
pub fn normal_handler(
    secret: State<SecretMgt>,
    email_creds: State<MailJetMgt>,
    data: Json<NormalRegisterData>) -> CustomResponse {

    let secret: String = secret.0.deref().to_string();
    let email_creds: &MailJetMgt = email_creds.deref();

    if !regexes::is_valid_name(&data.fullname) {
        return CustomResponse::error(format!("Fullname not valid"), Status::BadRequest);
    }
    if !regexes::is_valid_email(&data.email) {
        return CustomResponse::error(format!("Email not valid"), Status::BadRequest);
    }

    let exists_res = crate::db::exists_email(&data.email, &secret);
    if exists_res.is_err() {
        println!("{:?}", exists_res.unwrap_err());
        return CustomResponse::error(format!("Server Error"), Status::InternalServerError);
    }
    let exists_res = exists_res.unwrap();
    if exists_res {
        return CustomResponse::error(format!("Email benutzt"), Status::Unauthorized);
    }

    let (hash, salt) = passw::hash_passw(&data.password);

    let uid_res = crate::db::add_user(
        crate::db::User {
            fullname: (&data.fullname).to_owned(),
            normal: Some(crate::db::NormalLoginData {
                email: (&data.email).to_owned(),
                email_verified: false,
                password_hash: hash,
                password_salt: salt
            })
        },
        secret
    );

    if uid_res.is_err() {
        return CustomResponse::error(format!("Server Error"), Status::InternalServerError);
    }
    println!("Added user ID {}", uid_res.unwrap());

    super::email::send_register_email(
        &email_creds.user,
        &email_creds.key,
        &data.email,
        &data.fullname
    );

    return CustomResponse::message(format!("Ok"));
    
}
