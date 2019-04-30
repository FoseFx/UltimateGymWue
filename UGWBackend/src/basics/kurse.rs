use crate::responses::CustomResponse;
use rocket::http::Status;
use regex::Regex;
use crate::auth::guards::AuthGuard;
use crate::basics::guards::HasCredsGuard;
use crate::redismw::RedisConnection;
use std::error::Error;
use std::ops::Deref;
use crate::basics::utils::BasicCredsWrapper;

#[derive(Serialize,Deserialize)]
#[derive(Debug)]
pub struct Kurs {

}

#[get("/basics/kurse/<stufe>")]
pub fn get_all_kurse(_user: AuthGuard, creds: HasCredsGuard, redis_conn: RedisConnection, stufe: String) -> CustomResponse {
    let redis_conn = redis_conn.0.deref();
    if !is_stufe(&stufe) {
        return CustomResponse::error("Nicht als Stufe erkannt".to_string(), Status::BadRequest);
    }

    let kurse = get_kurse(redis_conn, creds.pl.schueler, stufe);

    if kurse.is_err() {
        return CustomResponse::error(kurse.unwrap_err().to_string(), Status::BadRequest);
    }

    return CustomResponse::data(kurse.unwrap());
}

fn is_stufe(string: &String) -> bool {
    let string = string.to_uppercase();
    let regex = Regex::new(r"^[A-Z0-9-]{2,5}$").unwrap();
    return regex.is_match(string.as_ref());
}

fn get_kurse(redis: &redis::Connection, creds: BasicCredsWrapper, stufe: String) -> Result<serde_json::Value, Box<Error>>{
    if false {
        fetch_kurse(creds, &stufe);
    }
    return Ok(json!("NIY"));
}

fn fetch_kurse(creds: BasicCredsWrapper, stufe: &String) -> Result<serde_json::Value, Box<Error>>{
    return Ok(json!("NIY"));
}

#[cfg(test)]
mod test {
    use crate::basics::kurse::is_stufe;

    #[test]
    fn test_is_stufe() {
        assert_eq!(is_stufe(&"".to_string()), false);
        assert_eq!(is_stufe(&"    ".to_string()), false);
        assert_eq!(is_stufe(&"  Q1  ".to_string()), false);
        assert_eq!(is_stufe(&"05C".to_string()), true);
        assert_eq!(is_stufe(&"08i-1".to_string()), true);
        assert_eq!(is_stufe(&"EF".to_string()), true);
        assert_eq!(is_stufe(&"Q1".to_string()), true);
    }

}
