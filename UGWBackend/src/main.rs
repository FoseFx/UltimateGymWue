#![feature(proc_macro_hygiene, decl_macro)]
extern crate rocket_contrib;
extern crate redis;
extern crate bcrypt;
#[macro_use] extern crate rocket;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json;

use rocket::Rocket;
use std::path::PathBuf;
use std::io::Cursor;
use rocket::response::{self, Response, Responder};
use std::time::{SystemTime, UNIX_EPOCH};
use std::process::Command;
use std::env::vars;
use std::error::Error;
use crate::basics::utils::BasicCreds;

pub struct SecretMgt(String);
pub struct DBURL {url: String}
pub struct MailJetMgt {user: String, key: String}
pub struct InstaSecretMgt {client_id: String, client_secret: String}

pub const EMAIL_DOMAIN: &'static str = "ugw.fosefx.com";
pub const SERVER_HOST: &'static str = "https://ugw.fosefx.com/api";
pub const GOOGLE_AUD: &'static str = "945920838122-ms73bj0tvdfcjijt1dqis687f98m167v.apps.googleusercontent.com";

static mut VALID_AUTH_PL: Option<BasicCreds> = None;

#[macro_export]
macro_rules! error {
    ( $( $x:expr ),* ) => {
        {
            let mut string: String;
            $(
                string = format!("{}", $x);
            )*
            return Err(Box::new(CustomError(string)));
        }
    };
}

mod auth;
mod db;
mod responses;
mod redismw;
mod basics;
mod catcher;
mod events;

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
            .raw_header("Access-Control-Allow-Origin", format!("https://ugw.fosefx.com"))
            .raw_header("Access-Control-Allow-Headers", format!("Content-Type,authorization,x-gw-auth"))
            .raw_header("Access-Control-Allow-Methods", format!("GET,POST,PUT"))
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
        .manage(get_insta_secret())
        .manage(get_db_url())
        .manage(get_mailjet_creds())
        .manage(redismw::pool())
        .mount(
            "/api",
            routes![
                status,
                auth::normal::normal::normal_handler,
                cors,
                auth::normal::normal::normal_verify_email_handler,
                auth::normal::normal::normal_login_handler,
                auth::google::register::handler::google_register_handler,
                auth::google::login::handler::google_login_handler,
                auth::insta::register::insta_register_code_handler,
                auth::insta::login::login_instagram_handler,
                auth::close_account::remove_account,
                basics::stufen::get_stufen_handler,
                basics::creds::add_creds_handler,
                basics::creds::get_creds_handler,
                basics::kurse::get_all_kurse,
                basics::set::set_basics,
                basics::stundenplan::get_sp,
                basics::vertretungsplan::get_vertretungsplan,
                basics::notifications::collect_subscription::add_subscription_handler,
                basics::notifications::get_vd_diff::get_vd_diff,
                events::month::get_months_events,
                events::add_event::put_add_event

            ]
        )
        .register(catchers![
                catcher::unauthorized,
                catcher::bad_request,
                catcher::not_found,
                catcher::internal_server_error
            ]
        );
}

fn get_db_url() -> DBURL {
    let mut isdev = false;
    for (env_key, _val) in vars(){
        if env_key == "DEVELOPMENT" {
            isdev = true;
        }
    }
    if isdev {
        return DBURL {url: format!("http://localhost:8080/")};
    }
    let outp = Command::new("nslookup")
             .arg("db")
             .output()
             .expect("failed to execute process");
    let mut st = String::new();
    for s in outp.stdout {
        st = format!("{}{}", st, s as char);
    }
    let split: Vec<&str> = st.split("\n").collect();
    let ip = split[2];
    let ip: Vec<&str> = ip.split(" ").collect();
    let ip = ip[2];
    println!("{}", &ip);
    return DBURL { url: format!("http://{}:8080/", ip)};
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

fn get_mailjet_creds() -> MailJetMgt {
    let mut user: Option<String> = None;
    let mut key: Option<String> = None;
    for (env_key, val) in std::env::vars(){
        if env_key == "MAIL_JET_USER" {
            user = Some(val);
        }
        else if env_key == "MAIL_JET_KEY" {
            key = Some(val);
        }
    }
    if user.is_none()  {
        panic!("No MAIL_JET_USER variable found");
    }
    if key.is_none()  {
        panic!("No MAIL_JET_KEY variable found");
    }

    return MailJetMgt {user: user.unwrap(), key: key.unwrap()}
}

fn get_insta_secret() -> InstaSecretMgt {
    let mut user: Option<String> = None;
    let mut key: Option<String> = None;
    for (env_key, val) in std::env::vars(){
        if env_key == "INSTA_CID" {
            user = Some(val);
        }
        else if env_key == "INSTA_SECRET" {
            key = Some(val);
        }
    }
    if user.is_none()  {
        panic!("No INSTA_CID variable found");
    }
    if key.is_none()  {
        panic!("No INSTA_SECRET variable found");
    }

    return InstaSecretMgt {
        client_id: user.unwrap(),
        client_secret: key.unwrap()
    };
}


fn main() {
    rocket().launch();
}

pub fn to_ascii(vec: Vec<u8>) -> String {
    let mut s = String::new();
    for c in vec {
        let charr = c as char;
        s.push(charr);
    }
    return s;
}

pub fn calc_exp() -> u64 {
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH)
        .expect("Time went backwards");
    let in_s = since_the_epoch.as_secs();

    return in_s + (60 * 60 * 24 * 30 * 6);
}

#[derive(Debug)]
pub struct CustomError (String);

impl std::fmt::Display for CustomError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl Error for CustomError {}




#[cfg(test)]
mod integration {
    use super::rocket;
    use rocket::local::Client;
    use rocket::http::Status;

    #[test]
    fn test_health() {
        let client = Client::new(rocket()).unwrap();
        let mut response = client.get("/api/health").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.body_string(), Some("Ok".into()));
    }

    #[test]
    fn test_cors() {
        let client = Client::new(rocket()).unwrap();
        let response = client.options("/api/jdisanj/sjdakldljakk/jsjkadhiuqwdjn/sodsajk").dispatch();
        assert_eq!(response.status(), Status::Ok);
        let headers = response.headers();
        let origin = headers.get("Access-Control-Allow-Origin").next();
        let allow_headers = headers.get("Access-Control-Allow-Headers").next();
        assert_eq!(origin, Some("https://ugw.fosefx.com".into()));
        assert_eq!(allow_headers, Some("Content-Type,authorization,x-gw-auth".into()));
    }
}
