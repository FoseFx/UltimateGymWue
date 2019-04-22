
extern crate reqwest;
extern crate base64;

use std::error::Error;
use std::collections::HashMap;
use rocket_contrib::json::JsonValue;

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
    pub google: Option<GoogleLoginData>
}

/// returns UserID
pub fn add_user(user: User, secret: String) -> Result<String, String> {

    let json_res = serde_json::to_string(&user);

    if json_res.is_err() {
        return Err(json_res.unwrap_err().description().to_string());
    }
    let json = json_res.unwrap();

    let base = base64::encode(&json);

    let client = reqwest::Client::new();
    let res = client.get(&format!("http://localhost:8080/register/{}", base)[..])
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

pub fn exists_email(email: &String, secret: &String) -> Result<bool, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("http://localhost:8080/existsemail/{}", email)[..])
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

pub fn verify_email(email: &String, secret: &String) {
    let client = reqwest::Client::new();
    let res = client.get(&format!("http://localhost:8080/verify_email/{}", email)[..])
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

pub fn get_login_data(email: &String, secret: &String) -> Result<LoginData, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("http://localhost:8080/login_normal/{}", email)[..])
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

pub fn exists_google_account(gid: &String, secret: &String) -> Result<bool, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("http://localhost:8080/exists_google/{}", gid)[..])
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

pub fn get_google_login_data(gid: &String, secret: &String) -> Result<crate::auth::jwt::UserClaim, String> {
    let client = reqwest::Client::new();
    let res = client.get(&format!("http://localhost:8080/login_google/{}", gid)[..])
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

    let user = list.get(0).unwrap();

    let claim = crate::auth::jwt::UserClaim {
        uid: user.get("uid").unwrap().as_str().unwrap().to_string(),
        fullname: user.get("fullname").unwrap().as_str().unwrap().to_string(),
        provider: vec!["google".to_string()],
        normal: None,
        google: Some(crate::auth::jwt::GoogleClaim {
            gid: gid.to_string(),
            email: user.get("google").unwrap().get("email").unwrap().as_str().unwrap().to_string()
        })
    };

    return Ok(claim);
}