#![feature(proc_macro_hygiene, decl_macro)]
extern crate crypto;
extern crate rocket_contrib;
#[macro_use] extern crate rocket;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json;

mod auth;

use rocket::Rocket;

#[get("/health")]
fn status() -> &'static str{
    return "Ok";
}


fn rocket() -> Rocket {
    return rocket::ignite().mount("/", routes![
        status,
        auth::normal::normal::normal_handler
    ]);
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