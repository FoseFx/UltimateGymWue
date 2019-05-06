use rocket::http::Status;
use crate::responses::CustomResponse;
use crate::basics::guards::HasCredsGuard;
use crate::auth::guards::AuthGuard;
use crate::redismw::RedisConnection;

#[get("/basics/stundenplan")]
pub fn get_sp(_user: AuthGuard, _creds: HasCredsGuard, _redis: RedisConnection) -> CustomResponse {

    // todo get kurse

    // todo get stundenplan

    // todo generate personal sp

    return CustomResponse::data(json!(["test"]));
    // return CustomResponse::error("Not Implemented yet".to_string(), Status::NotImplemented);
}