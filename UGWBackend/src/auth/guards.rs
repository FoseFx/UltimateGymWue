use crate::auth::jwt::UserClaim;
use rocket::State;
use crate::SecretMgt;

#[derive(Debug)]
pub struct AuthGuard {
    pub claim: UserClaim
}
#[derive(Debug)]
pub enum AuthGuardError {
    Missing,
    Invalid
}

impl<'a, 'r> rocket::request::FromRequest<'a, 'r> for AuthGuard {
    type Error = AuthGuardError;

    fn from_request(request: &'a rocket::request::Request<'r>) -> rocket::request::Outcome<Self, Self::Error> {

        let secret: String =  request.guard::<State<SecretMgt>>().unwrap().0.to_string();
        let auth_headers: Vec<_> = request.headers().get("authorization").collect();

        if auth_headers.len() == 1 {
            if is_valid_jwt(auth_headers[0], &secret) {
                return rocket::Outcome::Success(AuthGuard {claim: get_claim(auth_headers[0], &secret)});
            }
            return rocket::Outcome::Failure((rocket::http::Status::Unauthorized, AuthGuardError::Invalid));
        }

        return rocket::Outcome::Failure((rocket::http::Status::Unauthorized, AuthGuardError::Missing));

    }
}

fn is_valid_jwt(header: &str, secret: &String) -> bool {

    let header = header.to_string();
    if header.replace(" ", "").len() == 0 {
        return false;
    }

    let header: Vec<&str> = header.split(" ").collect();

    if header[0] != "Bearer" || header.len() != 2 {
        return false;
    }

    let token = header[1];
    let token: Vec<&str> = token.split(".").collect();

    if token.len() != 3 {
        return false;
    }

    let v_res = jsonwebtoken::verify(token[2], format!("{}.{}", token[0], token[1]).as_ref(), secret.as_ref(), jsonwebtoken::Algorithm::HS256);

    if v_res.is_err() {
        println!("error verifying token: {:?}", v_res);
        return false;
    }

    return v_res.unwrap();
}

fn get_claim(header: &str, secret: &String) -> UserClaim {

    let token: Vec<&str> = header.split(" ").collect();
    let token = token[1].to_string();

    let d_res = jsonwebtoken::decode::<UserClaim>(
        &token,
        secret.as_ref(),
        &jsonwebtoken::Validation::default()
    );

    let d_res = d_res.unwrap().claims;

    return d_res;

}








#[cfg(test)]
mod test {
    use crate::auth::guards::{is_valid_jwt, get_claim};
    use crate::auth::jwt::UserClaim;

    #[test]
    fn test_is_valid_jwt() {

        assert_eq!(is_valid_jwt("", &"test".to_string()), false);
        assert_eq!(is_valid_jwt("some invalid shit", &"test".to_string()), false);
        assert_eq!(is_valid_jwt("someinvalidshit", &"test".to_string()), false);

        assert_eq!(is_valid_jwt("Bearer some invalid shit", &"test".to_string()), false);
        assert_eq!(is_valid_jwt("Bearersomeinvalidshit", &"test".to_string()), false);
        assert_eq!(is_valid_jwt("Bearer someinvalidshit", &"test".to_string()), false);

        assert_eq!(
            is_valid_jwt(
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                &"test".to_string() // not matching to secret
            ),
            false
        );
        assert_eq!(
            is_valid_jwt(
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpVCJ9.yJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                &"test".to_string() // not a valid jwt
            ),
            false
        );

        assert_eq!(
            is_valid_jwt(
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA",
                &"test".to_string()
            ),
            true
        );

    }

    #[test]
    fn test_get_claim() {

        let res = get_claim(
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0IiwiZnVsbG5hbWUiOiJTb21lIE5hbWUiLCJwcm92aWRlciI6WyJnb29nbGUiXSwibm9ybWFsIjpudWxsLCJpbnN0YSI6bnVsbCwiZ29vZ2xlIjpudWxsLCJleHAiOjE5MDMxNzQzOTV9.4j8UaF5PgjaMvU1Vn0J4XG_JDoj_l6Sh-CM74-x_jDs",
            &"test".to_string()
        );
        let cmp = UserClaim {
            exp: 0,
            uid: "test".to_string(),
            fullname: "Some Name".to_string(),
            provider: vec!["google".to_string()],
            normal: None,
            insta: None,
            google: None
        };
        assert_eq!(res.uid, cmp.uid);
        assert_eq!(res.fullname, cmp.fullname);
        assert!(res.google.is_none());
        assert!(res.normal.is_none());
        assert!(res.insta.is_none());

    }

}