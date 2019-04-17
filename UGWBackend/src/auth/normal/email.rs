use crate::EMAIL_DOMAIN;

fn send_email(api_user: String,
              api_key: String,
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

fn get_auth_header(user: String, passw: String) -> (String, String) {
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

pub fn send_register_email(api_user: String,
                           api_key: String,
                           to: &String,
                           fullname: &String,
                           register_link: &String){
    send_email(
        api_user,
        api_key,
        format!("register@{}", EMAIL_DOMAIN),
        "Ultimate Gym Wue Register",
        to,
        fullname,
        format!("Verifiziere diese Email Adresse, um UGW nutzen zu können!"),
        format!("Klicke auf den Link, oder Kopiere den folgenden Link in deinen Browser: "), // todo
        format!("") // todo
    );
}