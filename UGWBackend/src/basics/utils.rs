
const BASE_URL: &'static str = "https://gymnasium-wuerselen.de/untis";

#[derive(Serialize,Deserialize)]
#[derive(Debug)]
pub struct BasicCreds {
    pub schueler: BasicCredsWrapper,
    pub lehrer: Option<BasicCredsWrapper>
}

#[derive(Serialize,Deserialize)]
#[derive(Debug)]
pub struct BasicCredsWrapper {
    pub username: String,
    pub password: String
}

impl BasicCredsWrapper {
    pub fn to_base_string(&self) -> String {
        let str = format!("{}:{}", self.username, self.password);
        let base = base64::encode(&str);
        return base;
    }
}

/// not tested
/// UNCACHED:
/// this sends a request to the school's server relative to the BASE_URL
/// and returns the body on a 200, any other code will fail and return a
/// reqwest::Error
pub fn fetch_schul_server(path: String, creds: &BasicCredsWrapper) -> Result<String, reqwest::Error> {

    let url = format!("{}{}", BASE_URL, path);

    let auth_header_content = creds_wrapper_to_basic(creds);

    let client = reqwest::Client::new();

    let res = client
        .get(&url)
        .header(reqwest::header::AUTHORIZATION, auth_header_content)
        .header(reqwest::header::USER_AGENT, "UGW Scrapper. https://ugw.fosefx.com/info")
        .send()?;
    let mut res = res.error_for_status()?;


    let body = res.text()?;
    return Ok(body);

}

/// tested
fn creds_wrapper_to_basic(creds: &BasicCredsWrapper) -> String {
    return format!(
        "Basic {}",
        base64::encode(&format!("{}:{}", creds.username, creds.password)[..])
    );
}


#[derive(Deserialize,Serialize)]
#[derive(Debug)]
pub struct Kurs {
    pub title: String,
    pub fach: String,
    pub lehrer: String
}


#[derive(Deserialize,Serialize)]
#[derive(Debug)]
pub struct KursRaum {
    pub kurs: String,
    pub raum: String
}

#[allow(non_snake_case)]
#[derive(Deserialize,Serialize)]
#[derive(Debug)]
pub struct TTKursField {
    pub typ: Option<String>,
    pub fach: Option<String>,
    pub raeume: Option<Vec<KursRaum>>,
    pub tag: Option<u8>,
    pub isUsed: Option<bool>,
    pub raum: Option<String>,
    pub lehrer: Option<String>
}

#[allow(non_snake_case)]
#[derive(Deserialize,Serialize)]
#[derive(Debug)]
pub struct TTField {
    pub typ: Option<String>,
    pub fach: Option<String>,
    pub raum: Option<String>,
    pub lehrer: Option<String>,
    pub name: Option<String>
}

impl TTField {
    pub fn empty() -> Self {
        return TTField {typ: None, fach: None, raum: None, lehrer: None, name: None};
    }
}

pub type TT = Vec<TTWeek>;
pub type TTWeek = Vec<TTDay>;
pub type TTDay = Vec<TTField>;

#[derive(Deserialize,Serialize)]
#[derive(Debug)]
pub struct TTWoche {
    pub days: Vec<Vec<TTKursField>>
}




#[cfg(test)]
mod test {
    use crate::basics::utils::{creds_wrapper_to_basic, BasicCredsWrapper};

    #[test]
    fn test_creds_wrapper_to_basic() {
        assert_eq!(creds_wrapper_to_basic(
            &BasicCredsWrapper {username: "indeedsome".to_string(), password: "test".to_string()}),
            "Basic aW5kZWVkc29tZTp0ZXN0"
        );

        assert_eq!(creds_wrapper_to_basic(
            &BasicCredsWrapper {username: "Ind3edsÖme".to_string(), password: "tÄst".to_string()}),
            "Basic SW5kM2Vkc8OWbWU6dMOEc3Q="
        );
    }

}