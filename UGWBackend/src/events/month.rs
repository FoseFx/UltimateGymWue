use crate::responses::CustomResponse;
use rocket::State;
use crate::{DBURL, SecretMgt};
use rocket::http::Status;
use std::ops::Deref;
use crate::redismw::RedisConnection;
use crate::redis::Commands;
use redis::RedisResult;
use crate::auth::guards::AuthGuard;

#[derive(Serialize,Deserialize,Debug)]
pub struct EventBy {
    pub name: String,
    pub uid: String
}

#[derive(Serialize,Deserialize,Debug)]
pub struct Event {
    pub name: String,
    pub typ: String,
    pub format: String,
    pub votes: i16,
    pub by: EventBy,
    pub begin: String,
    pub end: Option<String>, // Not for typ = Feiertag
    pub stufe: Option<String>, // only for typ = Klausur or Note
    pub kurs: Option<String> // only for typ = Klausur or Note
}

#[get("/events/<date>")]
pub fn get_months_events(_user: AuthGuard,
                         date: String,
                         db_url: State<DBURL>,
                         secret: State<SecretMgt>,
                         redis: RedisConnection) -> CustomResponse {
    let db_url = &db_url.url;
    let secret = secret.0.deref();
    let redis = redis.0.deref();
    let rx = regex::Regex::new(r"^\d{4}-\d{2}$").unwrap();
    if !rx.is_match(&date) {
        return CustomResponse::error(format!("Date must follow pattern: yyyy-mm"), Status::BadRequest);
    }

    let cache_key = format!("month_{}", &date);

    let cache_res: RedisResult<String> = redis.get(&cache_key);
    if cache_res.is_ok() {
        let cache_res = cache_res.unwrap();
        let serialized: Result<serde_json::Value, serde_json::Error> = serde_json::from_str(&cache_res[..]);
        if serialized.is_ok() {
            return CustomResponse::data(json!(serialized.unwrap()));
        }
        println!("Cache is damaged, could not serialize: {:#?}", serialized);
    }
    println!("No cache hit");



    let client = reqwest::Client::new();
    let resp = client.get(&format!("{}getEvents/{}", db_url, date))
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    if resp.is_err() {
        println!("{:#?}", resp);
        return CustomResponse::error(format!("Internal Server Error at resp"), Status::InternalServerError);
    }
    let mut resp = resp.unwrap();
    let as_json: Result<serde_json::Value, reqwest::Error> = resp.json();
    if as_json.is_err() {
        println!("{:#?}", as_json);
        return CustomResponse::error(format!("Internal Server Error at serialize"), Status::InternalServerError);
    }
    let as_json = as_json.unwrap();

    let as_str = serde_json::to_string(&as_json);
    if as_str.is_err() {
        println!("Could not stringify json {:#?}", as_str);
    } else {
        let _res: RedisResult<String> = redis.set_ex(&cache_key, as_str.unwrap(), 5 * 60 * 60);
    }

    return CustomResponse::data(as_json);
}