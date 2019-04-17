use crate::{EMAIL_DOMAIN, SERVER_HOST, to_ascii};
use rand::Rng;
use rand::distributions::Alphanumeric;
use redis::{Commands, RedisResult};

fn send_email(api_user: &String,
              api_key: &String,
              sender: String,
              sender_name: &str,
              to: &String,
              fullname: &String,
              subject: String,
              text: String,
              html: String) {
    let payload = json!({
        "Messages": [
            {
                "From": {
                    "EMail": sender,
                    "Name": sender_name
                },
                "To": [
                    {
                        "Email": to,
                        "Name": fullname
                    }
                ],
                "Subject": subject,
                "TextPart": text,
                "HTMLPart": html
            }
        ]
    });

    let auth_header = get_auth_header(api_user, api_key);

    let client = reqwest::Client::new();
    let req = client
        .post("https://api.mailjet.com/v3.1/send")
        .json(&payload)
        .header(&auth_header.0[..], &auth_header.1[..])
        .build();
    if req.is_ok() {
        let res = client.execute(req.unwrap());
        if res.is_ok() {
            println!("Made email-send-request: {:?}", res);
        } else {
            println!("Error making email-send-request {:?}", res.unwrap_err());
        }

    } else {
        println!("Error creating email-send-request {:?}", req.unwrap_err());
    }

}

fn get_auth_header(user: &String, passw: &String) -> (String, String) {
    let auth_header_payload =
        format!(
            "Basic {}",
            base64::encode(
                &format!(
                    "{}:{}",
                    user,
                    passw
                )
            )
        );
    return ("Authorization".to_string(), auth_header_payload);

}

pub fn send_register_email(redis_conn: &redis::Connection,
                           api_user: &String,
                           api_key: &String,
                           to: &String,
                           fullname: &String){

    let link = generate_email_verify_link(redis_conn, &to);
    send_email(
        api_user,
        api_key,
        format!("register@{}", EMAIL_DOMAIN),
        "Ultimate Gym Wue Register",
        to,
        fullname,
        format!("Verifiziere diese Email Adresse, um UGW nutzen zu können!"),
        format!("Klicke auf den Link, oder Kopiere den folgenden Link in deinen Browser: {}", link), // todo
        format!("<a href=\"{}\">Klicke hier, um dich zu registrieren</a>", link) // todo
    );
}

fn generate_email_verify_link(redis_conn: &redis::Connection, to: &String) -> String {
    let secret = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(24)
        .collect::<String>();

    let key = base64::encode(&format!("{}:{}", to, secret));
    let set_res: RedisResult<i8> = redis_conn.set_ex(format!("email_verify_{}", key), true, 10 * 60); // 10 min

    let url = format!("{}/auth/normal/verify_email/{}", SERVER_HOST, key);
    println!("New Verify URL: {}", url);
    return url;

}

pub fn verify_email(redis_conn: &redis::Connection, key: String, secret: String) -> Option<String> {

    let get_res: RedisResult<String> = redis_conn.get(format!("email_verify_{}", key));

    println!("{:?}", &get_res);

    if get_res.is_err() {
        return None;
    }

    let del_res: RedisResult<bool> = redis_conn.del(format!("email_verify_{}", key));

    let decoded = base64::decode(&key).unwrap();
    let as_string = to_ascii(decoded);

    let email = as_string.split(":").next().unwrap().to_string();
    return Some(email);
}