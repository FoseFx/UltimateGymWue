use rocket::http;
use rocket::request;
use rocket::Outcome;
use rocket::State;
use r2d2_redis::RedisConnectionManager;
use std::env::vars;


pub fn pool() -> r2d2::Pool<RedisConnectionManager> {

    let mut redis_full_path: Option<String> = Option::None;
    for (env_key, val) in vars(){
        if env_key == "REDIS_PATH" {
            redis_full_path = Some(val); // e.g. redis://0.0.0.0:6379/
        }
    }

    if redis_full_path.is_none() {
        panic!("No REDIS_PATH set");
    }

    let slice: &str = &redis_full_path.unwrap()[..]; // convert to &str for open() call

    println!("🌪  \u{1b}[0m\u{1b}[31;1mRedis Server: '{}' \u{1b}[0m", slice);

    let manager = RedisConnectionManager::new(slice).expect("connection manager");

    return r2d2::Pool::new(manager).expect("db pool");

}

// redis connection guard
pub struct RedisConnection(pub r2d2::PooledConnection<RedisConnectionManager>);

impl<'a, 'r> request::FromRequest<'a, 'r> for RedisConnection {
    type Error = ();

    fn from_request(request: &'a request::Request<'r>) -> request::Outcome<RedisConnection, ()> {
        let pool = request.guard::<State<r2d2::Pool<RedisConnectionManager>>>()?.clone();
        match pool.get() {
            Ok(conn) => Outcome::Success(RedisConnection(conn)),
            Err(_) => Outcome::Failure((http::Status::ServiceUnavailable, ())),
        }
    }
}