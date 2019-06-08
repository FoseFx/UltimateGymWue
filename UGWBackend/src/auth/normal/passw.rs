
use bcrypt::{hash, verify};
use std::error::Error;
use rand::Rng;
use rand::distributions::Alphanumeric;


/// returns: (hash, salt)
pub fn hash_passw(password: &String) -> Result<(String, String), Box<dyn Error>> {

    let salt = salt();

    let hash = hash(format!("{}{}", password, &salt), 10)?;

    return Ok((hash, salt));
}

fn salt() -> String {
    return rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(24)
        .collect::<String>();

}
pub fn verify_passw(passw: &String, hash: String, salt: String) -> bool {
    let res = verify(format!("{}{}", passw, salt), &hash[..]);
    if res.is_err() {
        println!("Verify passw: res is error: {:#?}", res);
        return false;
    }
    return res.unwrap();
}
