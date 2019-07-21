use crate::auth::guards::AuthGuard;
use crate::redismw::RedisConnection;
use rocket::State;
use crate::{SecretMgt, DBURL};
use rocket_contrib::json::Json;
use crate::responses::CustomResponse;
use crate::rocket::http::Status;

#[derive(Deserialize,Serialize,Debug)]
pub struct AddSubscriptionRequest {
    pub endpoint: String,
    pub keys: PushSubscriptionKeys
}

#[derive(Deserialize,Serialize,Debug)]
pub struct PushSubscriptionKeys {
    pub p256dh: String,
    pub auth: String
}


#[post("/basics/notifications/subscribe", data="<data>")]
pub fn add_subscription_handler(user: AuthGuard,
                            redis_conn: RedisConnection,
                            secret: State<SecretMgt>,
                            data: Json<AddSubscriptionRequest>,
                            db_url: State<DBURL>) -> CustomResponse {

    println!("{:#?}", data);
    return CustomResponse::error("Not implemented yet".to_string(), Status::NotImplemented);
}