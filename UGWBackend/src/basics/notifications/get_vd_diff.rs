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
    return CustomResponse::data(json!(diffed));
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
    // diff info box
    {
        let mut info_box_1 = day1.get(0).unwrap().as_array().unwrap().to_owned();
        let mut info_box_2 = day2.get(0).unwrap().as_array().unwrap().to_owned();
        // remove date
        info_box_1.remove(0);
        info_box_2.remove(0);
        let (info_additions, info_removals) = diff_arrs(&info_box_1, &info_box_2);
        // merge
        let mut info_changes = vec![];
        for addition in info_additions {
            info_changes.push(format!("+\"{}\"", addition.as_str().unwrap()));
        }
        for removal in info_removals {
            info_changes.push(format!("-\"{}\"", removal.as_str().unwrap()));
        }
        diff_vec.push(JsonValue::from(json!(info_changes)));
    }

    // diff vd
    {
        let mut new_obj: std::collections::HashMap<String, serde_json::Value> = std::collections::HashMap::new();
        let vd1 = day1.get(1).unwrap().as_object().unwrap();
        let vd2 = day2.get(1).unwrap().as_object().unwrap();
        let mut keys1: Vec<serde_json::Value> = vec![];
        let mut keys2: Vec<serde_json::Value> = vec![];
        for key in vd1.keys() {
            keys1.push(json!(key));
        }
        for key in vd2.keys() {
            keys2.push(json!(key));
        }
        let (added_keys, removed_keys) = diff_arrs(&keys1, &keys2);

        let mut dont_diff = vec![];

        for added in added_keys { // if key is new, add whole array to obj and dont diff later
            let string = added.as_str().unwrap();
            new_obj.insert(
                string.to_string(),
                vd1.get(string).unwrap().to_owned()
            );
            dont_diff.push(string.to_string());
        }
        for rmed in removed_keys { // if key is not in array anymore, add null to obj and dont diff later
            let string = rmed.as_str().unwrap();
            new_obj.insert(
                string.to_string(),
                serde_json::Value::Null
            );
            dont_diff.push(string.to_string());
        }

        let mut keys_to_diff: Vec<String> = vec![];
        for key in keys1.iter().chain(keys2.iter()) {
            let string = key.as_str().unwrap().to_string();
            if !dont_diff.contains(&string) && !keys_to_diff.contains(&string) {
                keys_to_diff.push(string);
            }
        }

        // at this point keys_to_diff contains all keys that need diffing
        // and all other keys are either fully or as null in obj

        for key in keys_to_diff {
            let (added_vd, rmmed_vd) = diff_arrs(
                vd1.get(&key[..]).unwrap().as_array().unwrap(),
                vd2.get(&key[..]).unwrap().as_array().unwrap()
            );
            let mut arr: Vec<serde_json::Value> = vec![];

            if !added_vd.is_empty() {
                for vd in added_vd {
                    arr.push(vd.to_owned());
                }
            }
            if !rmmed_vd.is_empty() {
                for vd in rmmed_vd {
                    let mut map = vd.as_object().unwrap().to_owned();
                    map.insert("removed".to_string(), json!(true));
                    arr.push(json!(map));
                }
            }
            if !arr.is_empty() {
                new_obj.insert(
                    key,
                    json!(arr)
                );
            }
        }

        diff_vec.push(JsonValue::from(json!(new_obj)));
    }

    return diff_vec;
}


fn get_date(day: &Vec<JsonValue>) -> &str {
    let info = day.get(0).unwrap();
    let info = info.as_array().unwrap();
    let date = info.get(0).unwrap();
    let date = date.as_str().unwrap();
    return date;
}

// arr1 is older
fn diff_arrs<'a, 'b>(arr2: &'b Vec<serde_json::Value>, arr1: &'a Vec<serde_json::Value>) -> (Vec<&'b serde_json::Value>, Vec<&'a serde_json::Value>) {
    let mut new_vec = vec![];
    let mut removed_vec = vec![];
    for obj in arr2 { // n^2
        if !array_contains(arr1, obj) {
            new_vec.push(obj);
        }
    }
    for obj in arr1 { // n^2
        if !array_contains(arr2, obj) {
            removed_vec.push(obj);
        }
    }
    return (new_vec, removed_vec);
}
fn array_contains(arr: &Vec<serde_json::Value>, val: &serde_json::Value) -> bool {
    for o in arr {
        if o.eq(val) {
            return true;
        }
    }
    return false;
}