#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct UserClaim {
    pub uid: String,
    pub fullname: String,
    pub provider: Vec<String>, // either 'normal' 'google' or 'insta'
    pub normal: Option<NormalClaim>,
    pub google: Option<GoogleClaim>
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

