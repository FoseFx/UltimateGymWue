//
// Handler for "normal" (email/pwd) login
//
extern crate rand;
use super::passw;
use rocket_contrib::json::{Json};

#[derive(Deserialize)]
#[derive(Debug)]
pub struct NormalRegisterData {
    fullname: String,
    email: String,
    password: String
}

#[post("/auth/normal/register", data = "<data>")]
pub fn normal_handler(data: Json<NormalRegisterData>) -> String {
    return format!("{:?}", passw::hash_passw(&data.password));
}
