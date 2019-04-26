use crate::auth::guards::AuthGuard;
use crate::basics::utils::BasicCredsWrapper;
use crate::redismw::RedisConnection;
use std::ops::Deref;
use std::error::Error;
use crate::redis::Commands;
use crate::basics::guards::HasCredsGuard;
use crate::responses::CustomResponse;

#[get("/basics/stufen")]
pub fn get_stufen_handler(user: AuthGuard, creds: HasCredsGuard, redis_conn: RedisConnection) -> CustomResponse {
    let redis_conn: &redis::Connection = redis_conn.0.deref();
    let creds = creds.pl.schueler;

    let stufen_res = get_stufe(redis_conn, BasicCredsWrapper{username: creds.username, password: creds.password});

    if stufen_res.is_err() {
        return CustomResponse::error("Fehler bei Verbindung zum Schulserver, haben sich die Anmeldedaten geändert?".to_string(), rocket::http::Status::BadRequest);
    }

    return CustomResponse::data(json!(stufen_res.unwrap()));
}


/// untested
/// this will try to gather the value using the redis cache, if not found it will fetch for it
/// creds must be schueler creds
fn get_stufe(redis_conn: &redis::Connection, creds: BasicCredsWrapper) -> Result<Vec<String>, Box<Error>> {

    let get_res: redis::RedisResult<String> = redis_conn.get("stufen");

    if get_res.is_ok() { // errors will be thrown when nil should be converted to String
        let get_res = get_res.unwrap();
        println!("stufen get res: {}", get_res);

        let vec: Vec<&str> = get_res.split(",").collect();

        let mut ret: Vec<String> = vec![];
        for s in vec {
            ret.push(s.to_string());
        }
        return Ok(ret);
    }

    // fetch file

    let navbar_res = get_navbar(redis_conn, creds)?;

    let (stufen, to_cache_str) = evaluate_stufen(navbar_res);

    let set_ex: redis::RedisResult<String> = redis_conn.set_ex("stufen", to_cache_str, 7 * 24 * 60 * 60); // 7 days cache

    println!("stufe set_ex: {:?}", set_ex);

    return Ok(stufen);
}


/// untested
/// this will try to gather the value using the redis cache, if not found it will fetch for it
/// creds must be schueler creds
fn get_navbar(redis_conn: &redis::Connection, creds: BasicCredsWrapper) -> Result<String, Box<Error>> {

    let redis_res: redis::RedisResult<String> = redis_conn.get("navbar");

    if redis_res.is_ok() {
        return Ok(redis_res.unwrap());
    }

    let fetch_res = fetch_navbar(creds)?;


    let redis_set_res: redis::RedisResult<String> = redis_conn.set_ex("navbar", fetch_res.clone(), 7 * 24 * 60 * 60);
    println!("redis set {:?}", &redis_set_res);

    return Ok(fetch_res);
}


/// untested
/// this will fetch and return the navbar-frame from /Schueler-Stundenplan/frames/navbar.htm
/// creds must be schueler creds
pub fn fetch_navbar(creds: BasicCredsWrapper) -> Result<String, reqwest::Error> {
    return super::utils::fetch_schul_server(
        format!("/Schueler-Stundenplan/frames/navbar.htm"),
        creds
    );
}

/// untested
fn evaluate_stufen(body: String) -> (Vec<String>, String) {
    println!("body: {}", &body);
    let mut ret_str = String::new();
    let mut ret_vec: Vec<String> = vec![];

    let get_arr_split: Vec<&str> = body.split("var classes = [\"").collect();
    let arr_to_end = get_arr_split[1]; // form the begin of the array to the end of file
    let arr_only: Vec<&str> = arr_to_end.split("\"];").collect();
    let arr_only = arr_only[0]; // only the array

    for s in arr_only.split("\",\"") {
        ret_str = format!("{},{}", ret_str, &s);
        ret_vec.push(s.to_string());
    }

    let ret_str = ret_str[1..].to_string(); // remove , at the beginning

    return (ret_vec, ret_str);

}