use crate::responses::CustomResponse;
use rocket::http::Status;
use crate::{VALID_AUTH_PL, DBURL, SecretMgt};
use redis::RedisResult;
use redis::Commands;
use crate::redismw::RedisConnection;
use std::ops::Deref;
use crate::basics::vertretungsplan::get_the_vertretungsplan;
use crate::basics::utils::BasicCreds;
use rocket::State;
use rocket_contrib::json::JsonValue;

pub static mut OLD_VD: Option<String> = None;

#[get("/basics/notifications/diff")]
pub fn get_vd_diff(redis: RedisConnection, secret: State<SecretMgt>, db_url: State<DBURL>) -> CustomResponse {
    let old_vd_str: String;
    let creds: BasicCreds;
    unsafe {
        if OLD_VD.is_none() {
            return CustomResponse::error("No Old VD Found".to_string(), Status::PreconditionFailed);
        }
        if VALID_AUTH_PL.is_none() {
            return CustomResponse::error("No Valid Auth Found".to_string(), Status::PreconditionFailed);
        }
        old_vd_str = OLD_VD.clone().unwrap();
        creds = VALID_AUTH_PL.clone().unwrap();
    }
    let vd_old: Result<Vec<Vec<JsonValue>>, serde_json::Error> = serde_json::from_str(old_vd_str.as_str());
    if vd_old.is_err() {
        return CustomResponse::error("Cached VD is corrupt".to_string(), Status::InternalServerError);
    }
    let vd_old = vd_old.unwrap();
    let redis_conn = redis.0.deref();
    let _: RedisResult<String> = redis_conn.del("vertretungsplan");
    let db_url = &db_url.url;
    let schueler_creds = &creds.schueler;
    let secret: &String = &secret.0.deref().to_string();
    let vd_now = get_the_vertretungsplan(db_url, schueler_creds, secret, redis_conn);
    if vd_now.is_err() {
        return CustomResponse::error("New VD could not be fetched".to_string(), Status::InternalServerError);
    }
    let vd_now = vd_now.unwrap();
    let diffed = diff(vd_old, vd_now);
    println!("{:#?}", &diffed);

    return CustomResponse::error("NIY".to_string(), Status::NotImplemented);
}

fn diff(then: Vec<Vec<JsonValue>>, now: Vec<Vec<JsonValue>>) -> Vec<Vec<JsonValue>> {
    let mut diff_vec = vec![];
    // Day 1
    let day_1 = now.get(0).unwrap();
    let day_2 = now.get(1).unwrap();
    let then_1 = then.get(0).unwrap();
    let then_2 = then.get(1).unwrap();
    let date_now_1 = get_date(day_1);
    let date_then_1 = get_date(then_1);
    let date_then_2 = get_date(then_2);

    if date_now_1 == date_then_1 {
        diff_vec.push(diff_day(day_1, then_1));
        diff_vec.push(diff_day(day_2, then_2));
    } else if date_now_1 == date_then_2 {
        diff_vec.push(diff_day(day_1, then_2));
        diff_vec.push(day_2.clone());
    } else {
        diff_vec.push(day_1.clone());
        diff_vec.push(day_2.clone());
    }
    return diff_vec;
}
// d1 newer
fn diff_day(day1: &Vec<JsonValue>, day2: &Vec<JsonValue>) -> Vec<JsonValue> {
    let mut diff_vec: Vec<JsonValue> = vec![];
    // todo

    return diff_vec;;
}


fn get_date(day: &Vec<JsonValue>) -> &str {
    return day.get(0).unwrap()
        .as_array().unwrap()
        .get(0).unwrap()
        .as_object().unwrap()
        .get("infos").unwrap()
        .get(0).unwrap()
        .as_str().unwrap();
}