#![feature(proc_macro_hygiene, decl_macro)]
extern crate crypto;
extern crate rocket_contrib;
#[macro_use] extern crate rocket;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json;

mod auth;
mod db;

use rocket::Rocket;


pub struct SecretMgt(String);


#[get("/health")]
fn status() -> &'static str{
    return "Ok";
}


fn rocket() -> Rocket {
    return rocket::ignite()
        .manage(get_secret())
        .mount(
            "/",
            routes![
            status,
            auth::normal::normal::normal_handler
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
}