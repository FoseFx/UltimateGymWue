#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct UserClaim {
    pub exp: u64,
    pub uid: String,
    pub fullname: String,
    pub provider: Vec<String>, // either 'normal' 'google' or 'insta'
    pub normal: Option<NormalClaim>,
    pub google: Option<GoogleClaim>,
    pub insta: Option<InstaClaim>
}

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct NormalClaim {
    pub email: String,
    pub email_verified: bool
}


#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct GoogleClaim {
    pub email: String,
    pub gid: String
}

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct InstaClaim {
    pub token: String,
    pub iid: String
}
