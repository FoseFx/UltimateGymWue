use crate::responses::CustomResponse;

#[catch(401)]
pub fn unauthorized() -> CustomResponse {
    return CustomResponse::error("Unauthorized".to_string(), rocket::http::Status::Unauthorized);
}

#[catch(400)]
pub fn bad_request() -> CustomResponse {
    return CustomResponse::error("Bad Request".to_string(), rocket::http::Status::BadRequest);
}


#[catch(500)]
pub fn internal_server_error() -> CustomResponse {
    return CustomResponse::error("Server Error".to_string(), rocket::http::Status::InternalServerError);
}

