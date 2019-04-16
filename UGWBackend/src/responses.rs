use rocket::{response, Response};
use rocket::response::Responder;
use std::io::Cursor;

pub struct CustomResponse {
    err: bool,
    msg: Option<String>,
    status: Option<rocket::http::Status>,
    data: Option<serde_json::Value>
}

impl CustomResponse {
    pub fn error(msg: String, status: rocket::http::Status) -> Self {
        return CustomResponse {err: true, msg: Some(msg), status: Some(status), data: None};
    }
    pub fn message(msg: String) -> Self {
        return CustomResponse {err: false, msg: Some(msg), status: None, data: None};

    }
    pub fn data(data: serde_json::Value) -> Self {
        return CustomResponse {err: false, msg: None, status: None, data: Some(data)};
    }
}

impl<'r> Responder<'r> for CustomResponse {
    fn respond_to(self, req: &rocket::request::Request) -> response::Result<'r> {
        if self.err {
            return ErrorResponse(self.msg.unwrap(), self.status.unwrap()).respond_to(req);
        } else if self.data.is_none() {
            return MessageResponse(self.msg.unwrap()).respond_to(req);
        } else {
            return DataResponse(self.data.unwrap()).respond_to(req);
        }
    }
}



pub struct ErrorResponse(String, rocket::http::Status);
impl<'r> Responder<'r> for ErrorResponse {
    fn respond_to(self, _: &rocket::request::Request) -> response::Result<'r> {
        Response::build()
            .sized_body(Cursor::new(format!("{}", json!({"error": true, "msg": self.0}))))
            .raw_header("Access-Control-Allow-Origin", format!("http://localhost:4200"))
            .raw_header("Access-Control-Allow-Headers", format!("Content-Type"))
            .header(rocket::http::ContentType::JSON)
            .status(self.1)
            .ok()
    }
}
struct MessageResponse(String);
impl<'r> Responder<'r> for MessageResponse {
    fn respond_to(self, _: &rocket::request::Request) -> response::Result<'r> {
        Response::build()
            .sized_body(Cursor::new(format!("{}", json!({"error": false, "msg": self.0}))))
            .raw_header("Access-Control-Allow-Origin", format!("http://localhost:4200"))
            .raw_header("Access-Control-Allow-Headers", format!("Content-Type"))
            .header(rocket::http::ContentType::JSON)
            .ok()
    }
}
struct DataResponse(serde_json::Value);
impl<'r> Responder<'r> for DataResponse {
    fn respond_to(self, _: &rocket::request::Request) -> response::Result<'r> {
        Response::build()
            .sized_body(Cursor::new(format!("{}", json!(json!({"error": false, "data": self.0})))))
            .raw_header("Access-Control-Allow-Origin", format!("http://localhost:4200"))
            .raw_header("Access-Control-Allow-Headers", format!("Content-Type"))
            .header(rocket::http::ContentType::JSON)
            .ok()
    }
}

#[cfg(test)]
mod tests {
    use rocket;
    use rocket::local::Client;
    use rocket::http::Status;
    use super::CustomResponse;

    #[get("/test-data")]
    fn sample_data() -> CustomResponse {
        return CustomResponse::data(json!({"someData": "Haha", "wow": 12321, "obj": json!({"key": "value", "number": 123432})}));
    }

    #[get("/test-error")]
    fn sample_error() -> CustomResponse {
        return CustomResponse::error(format!("Error"), rocket::http::Status::InternalServerError);
    }

    #[get("/test-msg")]
    fn sample_msg() -> CustomResponse {
        return CustomResponse::message(format!("Message"));
    }




    fn get_rocket() -> rocket::Rocket {
        return rocket::ignite().mount("/api",routes![sample_data,sample_error, sample_msg]);

    }


    #[test]
    fn test_message_response() {
        let client = Client::new(get_rocket()).unwrap();
        let mut response = client.get("/api/test-msg").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.body_string(), Some("{\"error\":false,\"msg\":\"Message\"}".into()));
        let headers = response.headers();
        let origin = headers.get("Access-Control-Allow-Origin").next();
        let allow_headers = headers.get("Access-Control-Allow-Headers").next();
        assert_eq!(origin, Some("http://localhost:4200".into()));
        assert_eq!(allow_headers, Some("Content-Type".into()));
    }

    #[test]
    fn test_error_response() {
        let client = Client::new(get_rocket()).unwrap();
        let mut response = client.get("/api/test-error").dispatch();
        assert_eq!(response.status(), Status::InternalServerError);
        assert_eq!(response.body_string(), Some("{\"error\":true,\"msg\":\"Error\"}".into()));
        let headers = response.headers();
        let origin = headers.get("Access-Control-Allow-Origin").next();
        let allow_headers = headers.get("Access-Control-Allow-Headers").next();
        assert_eq!(origin, Some("http://localhost:4200".into()));
        assert_eq!(allow_headers, Some("Content-Type".into()));
    }

    #[test]
    fn test_data_response() {
        let client = Client::new(get_rocket()).unwrap();
        let mut response = client.get("/api/test-data").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.body_string(), Some("{\"data\":{\"obj\":{\"key\":\"value\",\"number\":123432},\"someData\":\"Haha\",\"wow\":12321},\"error\":false}".into()));
        let headers = response.headers();
        let origin = headers.get("Access-Control-Allow-Origin").next();
        let allow_headers = headers.get("Access-Control-Allow-Headers").next();
        assert_eq!(origin, Some("http://localhost:4200".into()));
        assert_eq!(allow_headers, Some("Content-Type".into()));
    }


}