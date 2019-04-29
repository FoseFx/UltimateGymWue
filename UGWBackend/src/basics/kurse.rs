use crate::responses::CustomResponse;
use rocket::http::Status;
use regex::Regex;
use crate::auth::guards::AuthGuard;
use crate::basics::guards::HasCredsGuard;

#[derive(Serialize,Deserialize)]
#[derive(Debug)]
pub struct Kurs {

}

#[get("/basics/kurse/<stufe>")]
pub fn get_all_kurse(_user: AuthGuard, creds: HasCredsGuard, stufe: String) -> CustomResponse {
    if !is_stufe(&stufe) {
        return CustomResponse::error("Nicht als Stufe erkannt".to_string(), Status::BadRequest);
    }

    // todo

    return CustomResponse::error(stufe, Status::NotImplemented);
}

fn is_stufe(string: &String) -> bool {
    let string = string.to_uppercase();
    let regex = Regex::new(r"^[A-Z0-9-]{2,5}$").unwrap();
    return regex.is_match(string.as_ref());
}

#[cfg(test)]
mod test {
    use crate::basics::kurse::is_stufe;

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

}
