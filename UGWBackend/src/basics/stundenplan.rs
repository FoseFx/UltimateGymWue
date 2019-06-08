use rocket::http::Status;
use crate::responses::CustomResponse;
use crate::basics::guards::HasCredsGuard;
use crate::auth::guards::AuthGuard;
use crate::redismw::RedisConnection;
use std::error::Error;
use crate::basics::utils::{Kurs, BasicCredsWrapper, TTWoche, TTField, TT};
use crate::{SecretMgt, CustomError};
use rocket::State;
use std::ops::Deref;
use crate::basics::kurse::{stufe_to_id, get_wochen, fetch_kurse_and_tt};
use redis::RedisResult;
use crate::redis::Commands;
use crate::DBURL;

#[get("/basics/stundenplan")]
pub fn get_sp(user: AuthGuard, creds: HasCredsGuard, redis: RedisConnection, secret: State<SecretMgt>, db_url: State<DBURL>) -> CustomResponse {

    let db_url = &db_url.url;
    let redis = redis.0.deref();
    let creds = creds.pl.schueler;
    let secret: String = secret.0.deref().to_string();

    let kurse = get_users_kurse(&secret, user.claim.uid, db_url);
    if kurse.is_err() {
        let err = kurse.unwrap_err().to_string();
        if err.contains("402 Payment Required") {
            return CustomResponse::error("Kurse nicht gesetzt".to_string(), Status::BadRequest);
        } else if err.contains("401 Unauthorized"){
            return CustomResponse::error("Nutzer nicht gefunden".to_string(), Status::BadRequest);
        }
        return CustomResponse::error(err, Status::BadRequest);
    }
    let (stufe, kurse) = kurse.unwrap();

    let sp = get_stundenplan(redis, creds, &secret, &stufe, db_url);
    if sp.is_err() {
        return CustomResponse::error(sp.unwrap_err().to_string(), Status::BadRequest);
    }
    let sp = sp.unwrap();

    let sp = generate_personal_tt(&kurse,  &sp);
    if sp.is_err() {
        return CustomResponse::error(sp.unwrap_err().to_string(), Status::BadRequest);
    }
    let sp = sp.unwrap();

    return CustomResponse::data(json!({"kurse":kurse, "sp": sp, "stufe": stufe}));
    // return CustomResponse::error("Not Implemented yet".to_string(), Status::NotImplemented);
}

fn get_users_kurse(secret: &String, uid: String, db_url: &String) -> Result<(String, Vec<Kurs>), Box<dyn Error>> {
    let client = reqwest::Client::new();

    let res = client
        .get(&format!("{}users_kurse/{}", db_url, uid)[..])
        .header(reqwest::header::AUTHORIZATION, secret.to_owned())
        .send()?;
    let mut res = res.error_for_status()?;
    let res: serde_json::Value = res.json()?;


    let stufe = res.get("stufe");
    if stufe.is_none() {
        error!("stufe not found");
    }
    let stufe = stufe.unwrap().as_str().unwrap().to_string();
    let kurse = res.get("kurse");
    if kurse.is_none() {
        error!("kurse not found");
    }
    let kurse = kurse.unwrap();
    let kurse: Vec<Kurs> = serde_json::from_str(serde_json::to_string(kurse)?.as_str())?;

    return Ok((stufe, kurse));
}


fn get_stundenplan(redis_conn: &redis::Connection, schueler_creds: BasicCredsWrapper, secret: &String, stufe: &String, db_url: &String) -> Result<Vec<TTWoche>, Box<dyn Error>> {

    //
    let stufe_id = stufe_to_id(redis_conn, &schueler_creds, stufe, secret, db_url);
    if stufe_id.is_none() {
        error!("stufe not found");
    }
    let stufe_id = stufe_id.unwrap();

    let key = format!("kurse_{}", &stufe_id);
    let tt_key = format!("tt_{}", &stufe_id);
    let cached: RedisResult<String> = redis_conn.get(&tt_key); // will fail, when nil
    if cached.is_ok() {
        return Ok(serde_json::from_str(cached.unwrap().as_ref())?);
    }

    let wochen = get_wochen(redis_conn, &schueler_creds, secret, db_url);
    if wochen.is_err() {
        let err = wochen.unwrap_err();
        println!("error while getting wochen: {:#?}", &err);
        error!(format!("{:?}", err))
    }
    let wochen = wochen.unwrap();


    let kurse_and_tt = fetch_kurse_and_tt(schueler_creds, secret, stufe, &stufe_id, &wochen, db_url)?;
    let kurse = kurse_and_tt.kurse;
    let tt = kurse_and_tt.tt;

    let kurse_str = serde_json::to_string(&kurse)?;
    let tt_str = serde_json::to_string(&tt)?;
    let _: RedisResult<u8> = redis_conn.set_ex(key, kurse_str, 8 * 60 * 60);
    let _: RedisResult<u8> = redis_conn.set_ex(tt_key, tt_str, 8 * 60 * 60);

    return Ok(tt);
}

fn generate_personal_tt(kurse: &Vec<Kurs>, tt: &Vec<TTWoche>) -> Result<TT, Box<dyn Error>> {
    if tt.len() != 2 {
        error!("Stundenplan nicht vollständig");
    }
    let mut new_tt: TT = vec![];
    for woche in tt {
        let mut new_days = vec![];
        for day in &woche.days {
            let mut new_fields: Vec<TTField> = vec![];
            for kurs_field in day {
                if kurs_field.fach.is_none() {
                    new_fields.push(TTField::empty());
                } else {
                    let typ = match &kurs_field.typ {
                        Some(b) => b,
                        None => error!("Malformed"),
                    };
                    let fach = match &kurs_field.fach {
                            None => panic!(),
                            Some(v) => v
                        }.to_owned();
                    if typ == "klasse" {
                        let lehrer = match &kurs_field.lehrer {
                            None => panic!(),
                            Some(v) => v
                        }.to_owned();
                        let raum = match &kurs_field.raum {
                            None => panic!(),
                            Some(v) => v
                        }.to_owned();

                        new_fields.push(
                            TTField {
                                fach: Some(format!("{}", &fach)),
                                lehrer: Some(format!("{}", lehrer)),
                                raum: Some(format!("{}", raum)),
                                typ: Some(format!("klasse")),
                                name: Some(format!("{}", &fach)) // if klasse then name == fach
                            }
                        );
                        // todo
                    } else { // kurs

                        let mut sel_kurs: Option<&Kurs> = None;
                        for kurs in kurse {
                            if fach == kurs.title {
                                sel_kurs = Some(kurs);
                            }
                        }
                        if sel_kurs.is_none() {
                            new_fields.push(TTField::empty());
                            continue;
                        }
                        let sel_kurs = sel_kurs.unwrap();
                        let name = &sel_kurs.fach;
                        let mut raum = format!("");
                        match &kurs_field.raeume {
                            None => {},
                            Some(v) => {
                                for r in v {
                                    if r.kurs == sel_kurs.fach {
                                        raum = format!("{}", r.raum);
                                    }
                                }
                            }
                        };
                        new_fields.push(
                            TTField {
                                raum: Some(raum),
                                fach: Some(fach),
                                lehrer: Some(format!("{}", sel_kurs.lehrer)),
                                typ: Some(typ.to_owned()),
                                name: Some(format!("{}", name))
                            }
                        );
                    } // if kurs
                } // fach not none
            } // field in day
            new_days.push(new_fields);
        } // day in days
        new_tt.push(new_days);
    } // week in weeks

    return Ok(new_tt);
}