use crate::responses::CustomResponse;
use rocket::http::Status;

#[put("/events/new")]
pub fn put_add_event() -> CustomResponse {
    return CustomResponse::error(format!("Not implemented yet"), Status::NotImplemented);
}