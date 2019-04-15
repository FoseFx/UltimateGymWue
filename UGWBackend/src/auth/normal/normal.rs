//
// Handler for "normal" (email/pwd) login
//
extern crate rand;
use super::passw;
use rocket_contrib::json::{Json};
use rocket::response::status::Custom;
use rocket::response::status;
use rocket::http::Status;
use super::super::regexes;
use crate::SecretMgt;
use rocket::State;
use std::ops::Deref;

#[derive(Deserialize)]
#[derive(Debug)]
pub struct NormalRegisterData {
    fullname: String,
    email: String,
    password: String
}

#[post("/auth/normal/register", data = "<data>")]
pub fn normal_handler(secret: State<SecretMgt>,data: Json<NormalRegisterData>) -> status::Custom<String> {

    let secret: String = secret.0.deref().to_string();

    if !regexes::is_valid_name(&data.fullname) {
       return status::Custom(Status::BadRequest, format!("Fullname not valid"));
    }
    if !regexes::is_valid_email(&data.email) {
       return status::Custom(Status::BadRequest, format!("Email not valid"));
    }

    let exists_res = crate::db::exists_email(&data.email, &secret);
    if exists_res.is_err() {
        println!("{:?}", exists_res.unwrap_err());
        return status::Custom(Status::InternalServerError, format!("Server Error"));
    }
    let exists_res = exists_res.unwrap();
    if exists_res {
        return status::Custom(Status::Unauthorized, format!("Email benutzt"));
    }

    let (hash, salt) = passw::hash_passw(&data.password);

    let uid_res = crate::db::add_user(
        crate::db::User {
            fullname: (&data.fullname).to_owned(),
            normal: Some(crate::db::NormalLoginData {
                email: (&data.email).to_owned(),
                password_hash: hash,
                password_salt: salt
            })
        },
        secret
    );

    if uid_res.is_err() {
        return status::Custom(Status::InternalServerError, format!("Server Error"));
    }
    println!("Added user ID {}", uid_res.unwrap());
    return status::Custom(Status::Ok, format!("Ok"));
    
}