
extern crate reqwest;
extern crate base64;

use std::error::Error;
use std::collections::HashMap;
use rocket_contrib::json::JsonValue;
use crate::auth::jwt::{UserClaim, InstaClaim};
use crate::basics::utils::BasicCreds;
use crate::calc_exp;

#[derive(Serialize, Deserialize)]
pub struct NormalLoginData {
    pub email: String,
    pub email_verified: bool,
    pub password_hash: String,
    pub password_salt: String
}

#[derive(Serialize, Deserialize)]
pub struct GoogleLoginData {
    pub email: String,
    pub gid: String
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub fullname: String,
    pub normal: Option<NormalLoginData>,
    pub google: Option<GoogleLoginData>,
    pub instagram: Option<InstaLoginData>
}

#[derive(Serialize, Deserialize)]
pub struct InstaLoginData {
    pub iid: String,
    pub username: String,
    pub token: String
}

/// returns UserID
pub fn add_user(user: User, secret: String, db_url: &String) -> Result<String, String> {

    let json_res = serde_json::to_string(&user);

    if json_res.is_err() {
        return Err(json_res.unwrap_err().description().to_string());
    }
    let json = json_res.unwrap();

    let base = base64::encode(&json);

    let client = reqwest::Client::new();
    let res = client.get(&format!("{}register/{}", db_url, base)[..])
        .header(reqwest::header::AUTHORIZATION, secret)
        .send();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }

    let res = res.unwrap().error_for_status();

    if res.is_err() {
        return Err(format!("{:?}", res.unwrap_err()));
    }
    let mut res = res.unwrap();

    let res = res.text().unwrap();

    return Ok(res);

}

pub fn exists_email(email: &String, secret: &String, db_url: &String) -> Result<bool, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("{}existsemail/{}", db_url, email)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }

    let res = res.unwrap().error_for_status();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }
    let mut res = res.unwrap();
    let res = res.text().unwrap();

    return Ok(res == "true");

}

pub fn verify_email(email: &String, secret: &String, db_url: &String) {
    let client = reqwest::Client::new();
    let res = client.get(&format!("{}verify_email/{}", db_url, email)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    println!("{:?}", res);
}

#[derive(Debug)]
pub struct LoginData {
    pub hash: String,
    pub salt: String,
    pub uid: String,
    pub fullname: String,
    pub email: String,
    pub email_verified: bool
}

pub fn get_login_data(email: &String, secret: &String, db_url: &String) -> Result<LoginData, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("{}login_normal/{}", db_url, email)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }

    let res = res.unwrap().error_for_status();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }
    let mut res = res.unwrap();

    let hashmaps: Vec<HashMap<String, String>> = res.json().unwrap();
    
    if hashmaps.len() == 0 {
        return Err("Kein Account mit dieser Email gefunden".to_string());
    }

    let acc = hashmaps.get(0).unwrap();
    let acc = LoginData {
        hash: acc.get("hash").unwrap().to_string(),
        salt: acc.get("salt").unwrap().to_string(),
        uid: acc.get("uid").unwrap().to_string(),
        fullname: acc.get("fullname").unwrap().to_string(),
        email: acc.get("email").unwrap().to_string(),
        email_verified: acc.get("email_verified").unwrap() == "true",
    };

    return Ok(acc);
}

pub fn exists_google_account(gid: &String, secret: &String, db_url: &String) -> Result<bool, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("{}exists_google/{}", db_url, gid)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }

    let res = res.unwrap().error_for_status();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }
    let mut res = res.unwrap();
    let res = res.text().unwrap();

    return Ok(res == "true");

}

pub fn get_google_login_data(gid: &String, secret: &String, db_url: &String) -> Result<crate::auth::jwt::UserClaim, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("{}login_google/{}", db_url, gid)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }

    let res = res.unwrap().error_for_status();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }
    let mut res = res.unwrap();

    let list: Vec<HashMap<String, JsonValue>> = res.json().unwrap();
    if list.len() == 0 {
        return Err("Nutzer nicht gefunden".to_string());
    }

    let user = list.get(0).unwrap();

    let claim = crate::auth::jwt::UserClaim {
        exp: calc_exp(),
        uid: user.get("uid").unwrap().as_str().unwrap().to_string(),
        fullname: user.get("fullname").unwrap().as_str().unwrap().to_string(),
        provider: vec!["google".to_string()],
        normal: None,
        google: Some(crate::auth::jwt::GoogleClaim {
            gid: gid.to_string(),
            email: user.get("google").unwrap().get("email").unwrap().as_str().unwrap().to_string()
        }),
        insta: None
    };

    return Ok(claim);
}

pub fn exists_insta_account(iid: &String, secret: &String, db_url: &String) -> Result<bool, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("{}exists_insta/{}", db_url, iid)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }

    let res = res.unwrap().error_for_status();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }
    let mut res = res.unwrap();
    let res = res.text().unwrap();

    return Ok(res == "true");
}


pub fn login_insta(iid: &String, secret: &String, db_url: &String) -> Result<UserClaim, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("{}login_insta/{}", db_url, iid)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }

    let res = res.unwrap().error_for_status();
    if res.is_err(){
        return Err(format!("{:?}", res.unwrap_err()));
    }
    let mut res = res.unwrap();

    let list: Vec<HashMap<String, JsonValue>> = res.json().unwrap();

    if list.len() == 0 {
        return Err("Nutzer nicht gefunden".to_string());
    }
    let user = list.get(0).unwrap();
    println!("user {:#?}", &user);
    let claim = crate::auth::jwt::UserClaim {
        exp: calc_exp(),
        uid: user.get("uid").unwrap().as_str().unwrap().to_string(),
        fullname: user.get("fullname").unwrap().as_str().unwrap().to_string(),
        provider: vec!["insta".to_string()],
        normal: None,
        google: None,
        insta: Some(InstaClaim {
            iid: format!("{}", iid),
            token: user.get("instagram").unwrap().get("token").unwrap().as_str().unwrap().to_string()
        })
    };

    return Ok(claim);
}

pub fn add_creds_to_user(uid: &String,  creds: &BasicCreds, secret: &String, db_url: &String) -> Result<String, Box<dyn Error>> {
    let client = reqwest::Client::new();

    let jsonv = json!({
        "uid": uid,
        "pl": creds
    });

    let json_res = serde_json::to_string(&jsonv)?;
    println!("{:?}", json_res);

    let base = base64::encode(&json_res);

    let res = client.get(&format!("{}add_creds/{}", db_url, base)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send()?;

    let mut res = res.error_for_status()?;

    return Ok(res.text()?);
}

pub fn get_creds_from_user(uid: &String, secret: &String, db_url: &String) -> Result<BasicCreds, Box<dyn Error>> {
    let client = reqwest::Client::new();

    let res = client.get(&format!("{}get_creds/{}", db_url, uid))
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send()?;
    let mut res = res.error_for_status()?;

    let creds: BasicCreds = serde_json::from_str(res.text()?.as_ref())?;

    return Ok(creds);

}


pub fn remove_user_account(uid: &String, secret: &String, db_url: &String) -> Result<bool, Box<dyn Error>> {
    let client = reqwest::Client::new();

    let res = client.get(&format!("{}removeAccount/{}", db_url, uid))
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send()?;
    let _res = res.error_for_status()?;

    return Ok(true);
}