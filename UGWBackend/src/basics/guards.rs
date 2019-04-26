use crate::basics::utils::{BasicCredsWrapper, BasicCreds};
use rocket::{Request, State};
use rocket::request::Outcome;
use crate::SecretMgt;
use crate::auth::guards::is_valid_jwt;
use rocket_contrib::json::JsonValue;

#[derive(Debug)]
pub struct HasCredsGuard {
    pub token: String,
    pub pl: BasicCreds
}

#[derive(Debug)]
pub enum HasCredsGuardError {
    Missing,
    Invalid
}

impl<'a, 'r> rocket::request::FromRequest<'a, 'r> for HasCredsGuard {
    type Error = HasCredsGuardError;

    fn from_request(request: &'a Request<'r>) -> Outcome<Self, Self::Error> {

        let secret: String =  request.guard::<State<SecretMgt>>().unwrap().0.to_string();
        let auth_headers: Vec<_> = request.headers().get("x-gw-auth").collect();


        if auth_headers.len() == 1 {
            if is_valid_jwt(auth_headers[0], &secret) {
                let claim = get_claim(auth_headers[0], &secret);
                return rocket::Outcome::Success( HasCredsGuard {token: auth_headers[0].to_string(), pl: claim} );
            }
            return rocket::Outcome::Failure((rocket::http::Status::Unauthorized, HasCredsGuardError::Invalid));
        }

        return rocket::Outcome::Failure((rocket::http::Status::Unauthorized, HasCredsGuardError::Missing));


    }
}

pub fn get_claim(header: &str, secret: &String) -> BasicCreds {

    let token: Vec<&str> = header.split(" ").collect();
    let token = token[1].to_string();

    let d_res = jsonwebtoken::decode::<JsonValue>(
        &token,
        secret.as_ref(),
        &jsonwebtoken::Validation::default()
    );

    let d_res = d_res.unwrap().claims;
    let schueler = d_res.get("schueler").unwrap().as_object().unwrap();
    let schueler = BasicCredsWrapper {
        username: schueler.get("username").unwrap().to_owned().as_str().unwrap().to_string(),
        password: schueler.get("password").unwrap().to_owned().as_str().unwrap().to_string(),
    };
    let lehrer = d_res.get("lehrer").unwrap().as_object();

    let mut final_lehrer: Option<BasicCredsWrapper>;
    if lehrer.is_some() {
        let l = lehrer.unwrap();
        let u = l.get("username").unwrap().to_owned().as_str().unwrap().to_string();
        let p = l.get("password").unwrap().to_owned().as_str().unwrap().to_string();
        final_lehrer = Some(BasicCredsWrapper {username: u, password: p});
    } else {
        final_lehrer = None;
    }

    let ret = BasicCreds {
        schueler,
        lehrer: final_lehrer
    };

    return ret;
}