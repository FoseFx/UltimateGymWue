
use crypto::digest::Digest;
use crypto::sha1::Sha1;
use rand::Rng;
use rand::distributions::Alphanumeric;


/// returns: (hash, salt)
pub fn hash_passw(password: &String) -> (String, String) {

    let salt = salt();

    let hex = sha1(format!("{}{}", password, &salt));

    return (hex, salt);
}

fn salt() -> String {
    return rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(24)
        .collect::<String>();

}
fn sha1(string: String) -> String {
    let mut hasher = Sha1::new();
    hasher.input_str(string.as_str());
    let hex = hasher.result_str();
    return hex;
}

pub fn verify_passw(passw: &String, hash: String, salt: String) -> bool {
    let hex = sha1(format!("{}{}", passw, salt));
    return hex == hash;
}














#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_salt() {
        assert_eq!(salt().len(), 24);
    }

    #[test]
    fn test_sha1() {
        assert_eq!(sha1("Complex Test".to_string()), "a7ff42fbef3350e6fc083fe29175627b379cb191");
    }

    #[test]
    fn test_verify_passw() {
        assert_eq!(
            verify_passw(
                format!("Secure Password"),
                format!("e842a1b305ba638037ca7783a55adcdf643ae219"),
                format!("cj7nrY5PXVc173KrtU2GFCcC")
            ),
            true
        );
        assert_eq!(
            verify_passw(
                format!("Secure Password"),
                format!("842a1b305ba638037ca7783a55adcdf643ae219"),
                format!("cj7nrY5PXVc173KrtU2GFCcC")
            ),
            false
        );
    }

    #[test]
    fn test_hash_passw(){
        let (hash, salt) = hash_passw(&"Secure Password".to_string());
        // we assume verify_passw works
        assert_eq!(
            verify_passw(
                format!("Secure Password"),
                hash,
                salt
            ),
            true
        );
    }

}


