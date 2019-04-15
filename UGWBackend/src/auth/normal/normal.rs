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

#[derive(Deserialize)]
#[derive(Debug)]
pub struct NormalRegisterData {
    fullname: String,
    email: String,
    password: String
}

#[post("/auth/normal/register", data = "<data>")]
pub fn normal_handler(data: Json<NormalRegisterData>) -> status::Custom<String> {
    if !regexes::is_valid_name(&data.fullname) {
       return status::Custom(Status::BadRequest, format!("Fullname not valid"));
    }
    if !regexes::is_valid_email(&data.email) {
       return status::Custom(Status::BadRequest, format!("Email not valid"));
    }

    // password enforcment here

    let (hash, salt) = passw::hash_passw(&data.password);

    return status::Custom(Status::Ok, format!("Ok"));
    
}
