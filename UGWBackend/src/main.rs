#![feature(proc_macro_hygiene, decl_macro)]
extern crate crypto;
extern crate rocket_contrib;
#[macro_use] extern crate rocket;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json;

mod auth;
mod db;

use rocket::Rocket;
use std::path::PathBuf;
use std::io::Cursor;
use rocket::response::{self, Response, Responder};

pub struct SecretMgt(String);


#[get("/health")]
fn status() -> &'static str{
    return "Ok";
}

//
// CORS
//
struct CORSResponder(String);
impl<'r> Responder<'r> for CORSResponder {
    fn respond_to(self, _: &rocket::request::Request) -> response::Result<'r> {
        Response::build()
            .sized_body(Cursor::new(self.0))
            .raw_header("Access-Control-Allow-Origin", format!("*"))
            .raw_header("Access-Control-Allow-Headers", format!("Content-Type"))
            .ok()
    }
}
#[options("/<_path..>")]
fn cors(_path: PathBuf) -> CORSResponder {
    // Access-Control-Allow-Origin *
    return CORSResponder("Ok".to_string());
}
//////


fn rocket() -> Rocket {
    return rocket::ignite()
        .manage(get_secret())
        .mount(
            "/",
            routes![
            status,
            auth::normal::normal::normal_handler,
            cors
            ]
        );
}


fn get_secret() -> SecretMgt {

    let mut secret: Option<String> = None;
    for (env_key, val) in std::env::vars(){
        if env_key == "SECRET" {
            secret = Some(val);
        }
    }
    if secret.is_none() {
        panic!("No Secret variable found");
    }
    return SecretMgt(secret.unwrap());
}


fn main() {
    rocket().launch();
}


#[cfg(test)]
mod integration {
    use super::rocket;
    use rocket::local::Client;
    use rocket::http::Status;

    #[test]
    fn test_health() {
        let client = Client::new(rocket()).unwrap();
        let mut response = client.get("/health").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.body_string(), Some("Ok".into()));
    }

    #[test]
    fn test_cors() {
        let client = Client::new(rocket()).unwrap();
        let response = client.options("/jdisanj/sjdakldljakk/jsjkadhiuqwdjn/sodsajk").dispatch();
        assert_eq!(response.status(), Status::Ok);
        let headers = response.headers();
        let origin = headers.get("Access-Control-Allow-Origin").next();
        let allow_headers = headers.get("Access-Control-Allow-Headers").next();
        assert_eq!(origin, Some("*".into()));
        assert_eq!(allow_headers, Some("Content-Type".into()));


    }
}