use crate::responses::CustomResponse;
use rocket::http::Status;
use regex::Regex;
use crate::auth::guards::AuthGuard;
use crate::basics::guards::HasCredsGuard;
use crate::redismw::RedisConnection;
use std::error::Error;
use std::ops::Deref;
use crate::basics::utils::{BasicCredsWrapper, TTWoche, Kurs};
use redis::RedisResult;
use crate::redis::Commands;
use crate::SecretMgt;
use rocket::State;

#[get("/basics/kurse/<stufe>")]
pub fn get_all_kurse(_user: AuthGuard,
                     creds: HasCredsGuard,
                     redis_conn: RedisConnection,
                     secret: State<SecretMgt>,
                     stufe: String) -> CustomResponse {

    let redis_conn = redis_conn.0.deref();
    let schueler_creds = creds.pl.schueler;
    let secret: String = secret.0.deref().to_string();

    if !is_stufe(&stufe) {
        return CustomResponse::error("Nicht als Stufe erkannt".to_string(), Status::BadRequest);
    }

    let stufe_id = stufe_to_id(redis_conn, &schueler_creds, &stufe);
    if stufe_id.is_none() {
        return CustomResponse::error("Stufe nicht gefunden".to_string(), Status::BadRequest);
    }
    let stufe_id = stufe_id.unwrap();
    println!("stufe_id: {}", &stufe_id);

    let wochen = get_wochen(redis_conn, &schueler_creds);
    if wochen.is_err() {
        let err = wochen.unwrap_err();
        println!("error while getiign wochen: {:#?}", &err);
        return CustomResponse::error(err.to_string(), Status::InternalServerError);
    }
    let wochen = wochen.unwrap();
    println!("wochen: {:?}", wochen);

    let kurse = get_kurse(redis_conn, schueler_creds, &secret, stufe, &stufe_id, &wochen);
    println!("kurse: {:?}", &kurse);

    if kurse.is_err() {
        return CustomResponse::error(kurse.unwrap_err().to_string(), Status::BadRequest);
    }

    return CustomResponse::data(json!(kurse.unwrap()));
}


/// tested
fn is_stufe(string: &String) -> bool {
    let string = string.to_uppercase();
    let regex = Regex::new(r"^[A-Z0-9-]{2,5}$").unwrap();
    return regex.is_match(string.as_ref());
}

/// untested
/// creds: schueler-creds
/// stufe: must be trusted
/// stufe_id: must be trusted
/// error: reqwest
fn get_kurse(redis: &redis::Connection, creds: BasicCredsWrapper, secret: &String, stufe: String, stufe_id: &String, wochen: &Vec<String>) -> Result<Vec<Kurs>, Box<Error>>{

    let key = format!("kurse_{}", &stufe_id);
    let tt_key = format!("tt_{}", &stufe_id);
    let cached: RedisResult<String> = redis.get(&key); // will fail, when nil
    println!("cached: {:?}", &cached);
    if cached.is_ok() {
        return Ok(serde_json::from_str(cached.unwrap().as_ref())?);
    }
    let kurse_and_tt = fetch_kurse_and_tt(creds, secret, &stufe, stufe_id, wochen)?;
    let kurse = kurse_and_tt.kurse;
    let tt = kurse_and_tt.tt;

    let kurse_str = serde_json::to_string(&kurse)?;
    let tt_str = serde_json::to_string(&tt)?;
    let _: RedisResult<u8> = redis.set_ex(key, kurse_str, 8 * 60 * 60);
    let _: RedisResult<u8> = redis.set_ex(tt_key, tt_str, 8 * 60 * 60);

    return Ok(kurse);
}

#[derive(Deserialize,Serialize)]
#[derive(Debug)]
pub struct FetchKurseAndTTResult {
    pub tt: Vec<TTWoche>,
    pub kurse: Vec<Kurs>
}


/// untested
/// creds: schueler-creds
/// stufe: must be trusted
/// stufe_id: must be trusted
/// error: reqwest
pub fn fetch_kurse_and_tt(creds: BasicCredsWrapper, secret: &String, stufe: &String, stufe_id: &String, wochen: &Vec<String>) -> Result<FetchKurseAndTTResult, Box<Error>>{
    let client = reqwest::Client::new();

    let json = serde_json::to_string(&json!({
        "stufe": stufe.to_string(),
        "stufe_id": stufe_id.to_string(),
        "wochen": wochen.to_owned(),
        "creds": creds.to_base_string()
    }))?;
    println!("json: {:?}", &json);
    let base = base64::encode(&json);
    println!("base: {:?}", &base);

    let mut res = client
        .get(&format!("http://db/getKurseAndTT/{}", base)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send()?;

    let res_json: FetchKurseAndTTResult = res.json()?;

    return Ok(res_json);
}

/// untested
pub fn stufe_to_id(redis: &redis::Connection, creds: &BasicCredsWrapper, stufe: &String) -> Option<String>{
    let stufen_arr = super::stufen::get_stufe(redis, creds);
    if stufen_arr.is_err() {
        return None;
    }
    let stufen_arr = stufen_arr.unwrap();
    let mut id: Option<String> = None;

    for (i, stf) in stufen_arr.iter().enumerate() {
        let index = i + 1;
        if stf.to_uppercase().trim() == stufe.trim() {
            id = Some(format!("c{}.htm", to_five(&index.to_string())));
        }
    }

    return id;

}

/// unstested
pub fn get_wochen(redis: &redis::Connection, creds: &BasicCredsWrapper) -> Result<Vec<String>, Box<Error>> {
    let cache: RedisResult<String> = redis.get("wochen"); // will fail, when nil
    if cache.is_ok() {
        let cache = cache.unwrap();
        let vec: Vec<&str> = cache.split(",").collect();
        let mut ret: Vec<String> = vec![];
        for v in vec.iter() {
            ret.push(v.to_owned().to_owned());
        }
        return Ok(ret);
    }

    let nav = super::stufen::get_navbar(redis, creds)?;

    let vec: Vec<&str> = nav.split("<option value=\"").collect();

    let a = vec.get(1).unwrap().to_string();
    let b = vec.get(2).unwrap().to_string();

    let wochen: Vec<String> = vec![
        a[0..2].to_string(),
        b[0..2].to_string()
    ];
    let cache_str = format!("{},{}", &wochen[0], &wochen[1]);

    let _: RedisResult<String> = redis.set_ex("wochen", cache_str, 24 * 60 * 60);

    return Ok(wochen);
}

/// tested
/// adds '0's in front of your string until it has the length of 5
fn to_five(str: &String) -> String {
    let mut ret = str.to_owned();
    while ret.len() < 5 {
        ret = format!("0{}", ret);
    }
    return ret;
}

#[cfg(test)]
mod test {
    use crate::basics::kurse::{is_stufe, to_five};

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


    #[test]
    fn test_to_five() {
        assert_eq!(to_five(&"1".to_string()), "00001");
        assert_eq!(to_five(&"00001".to_string()), "00001");
        assert_eq!(to_five(&"000001".to_string()), "000001");
        assert_eq!(to_five(&"01010".to_string()), "01010");
    }
}
