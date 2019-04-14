#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;


#[get("/health")]
fn status() -> &'static str{
    return "Ok";
}


fn main() {
    rocket::ignite().mount("/", routes![
        status
    ]).launch();
}
