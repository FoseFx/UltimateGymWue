use crate::auth::guards::AuthGuard;

#[get("/basics/stufen")]
pub fn get_stufen(user: AuthGuard) -> String {
    return format!("{:?}", user);
}