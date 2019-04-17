
extern crate reqwest;
extern crate base64;

use std::error::Error;

#[derive(Serialize, Deserialize)]
pub struct NormalLoginData {
    pub email: String,
    pub email_verified: bool,
    pub password_hash: String,
    pub password_salt: String
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub fullname: String,
    pub normal: Option<NormalLoginData>
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