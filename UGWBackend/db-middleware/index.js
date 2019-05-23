const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const http = require("http");
const getKurseAndTT = require('./kurse').getKurseAndTT;
const getVertretungsdaten = require('./vp').getVertretungsdaten;
const fetch = require("node-fetch");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

http.createServer((req, res) => {

  if (req.headers['authorization'] !== process.env['SECRET']){
    res.statusCode = 401;
    return res.end("Unauthorized");
  }

  if (/^\/existsemail\/.*$/.test(req.url)){
    return existsEmail(req, res);
  }

  if (/^\/verify_email\/.*$/.test(req.url)){
    return verify_email(req, res);
  }

  if (/^\/login_normal\/.*$/.test(req.url)){
    return login_normal(req, res);
  }

  if (/^\/register\/.*$/.test(req.url)) {
    return registerUser(req, res);
  }
  if (/^\/exists_google\/.*$/.test(req.url)) {
    return existsGoogle(req, res);
  }
  if (/^\/login_google\/.*$/.test(req.url)) {
    return loginGoogle(req, res);
  }
  if (/^\/exists_insta\/.*$/.test(req.url)) {
    return existsInsta(req, res);
  }
  if (/^\/login_insta\/.*$/.test(req.url)) {
    return loginInsta(req, res);
  }

  if (/^\/add_creds\/.*$/.test(req.url)) {
    return addCreds(req, res);
  }

  if (/^\/get_creds\/.*$/.test(req.url)) {
    return getCreds(req, res);
  }
  if (/^\/getKurseAndTT\/.*$/.test(req.url)) {
    return api_getKurseAndTT(req, res);
  }
  if (/^\/set_basics\/.*$/.test(req.url)) {
    return setBasics(req, res);
  }
  if (/^\/users_kurse\/.*$/.test(req.url)) {
    return getUsersKurse(req, res);
  }
  if (/^\/proxy\/.*$/.test(req.url)) {
    return proxy(req, res);
  }
  if (/^\/vp\/.*$/.test(req.url)) {
    return vp(req, res);
  }

  res.statusCode = 404;
  res.end();
}).listen(8080, () => {
    console.log("DB Middleware server listening on port 8080");
});

function registerUser(req, res){
  
  let base = req.url.replace("/register/", "").replace("/", "");
  let as_string = Buffer.from(base, 'base64').toString('ascii');
  let as_obj = JSON.parse(as_string);

  console.log(as_obj);
  db.collection('users').add(as_obj).then(ref => {
    res.end("" + ref.id);
  }).catch((err) => {
    console.error(err);
    res.end("err");
  });
  
}

function existsEmail(req, res) {
  const email = req.url.replace('/existsemail/', '').replace('/', '');
  console.log(email);
  
  db.collection('users').where('normal.email', '==', email).limit(1).get()
  .then((snapshot) => {
    if (snapshot.empty) {

      db.collection('users').where('google.email', '==', email).limit(1).get().then((snap) => {
        if (snap.empty) {
          console.log("false");
          return res.end("false");        
        }
        console.log("true");
        res.end("true");

      }).catch((err) => {
        console.error(err);
        res.statusCode = 500;
        res.end("Err");
      });

    } else {
      console.log("true");
      res.end("true");
    }
  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("Err");
  });
}


function verify_email(req, res){
  console.log(req.url.replace('/verify_email/', '').replace('/', ''));
  db.collection('users').where('normal.email', '==', req.url.replace('/verify_email/', '').replace('/', '')).limit(1).get()
  .then((snapshot) => {
    if (snapshot.empty) {
      console.log("false");
      
      return res.end("false");
    }
    
    snapshot.forEach((doc) => {
      db.collection('users')
      .doc(doc.id + "")
      .set({normal: {email_verified: true}}, {merge: true})
      .then(() => {
        res.end("true");
      }).catch(() => {
        res.end("false");
      });
    });
   
    
  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("Err");
  });
}

function login_normal(req, res){
  console.log(req.url.replace('/login_normal/', '').replace('/', ''));
  db.collection('users').where('normal.email', '==', req.url.replace('/login_normal/', '').replace('/', '')).limit(1).get()
  .then((snapshot) => {
    if (snapshot.empty) {
      console.log("false");
      
      return res.end("[]");
    }
    
    let arr = [];
    snapshot.forEach((doc) => {
      let data = doc.data();
      data = data.normal;
      arr.push({
        hash: data.password_hash,
        salt: data.password_salt,
        uid: doc.id,
        fullname: doc.data().fullname,
        email_verified: data.email_verified + "",
        email: data.email
      });
    });
    return res.end(JSON.stringify(arr));
   
    
  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("[]");
  });
}

function existsGoogle(req, res) {
  const gid = req.url.replace('/exists_google/', '').replace('/', '');
  console.log(gid);
  
  db.collection('users').where('google.gid', '==', gid).limit(1).get()
  .then((snapshot) => {
    if (snapshot.empty) {
      console.log("false");
      res.end("false");

    } else {
      console.log("true");
      res.end("true");
    }
  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("Err");
  });
}

function loginGoogle(req, res){
  const gid = req.url.replace('/login_google/', '').replace('/', '');
  console.log(gid);
  db.collection('users').where('google.gid', '==', gid).limit(1).get()
  .then((snapshot) => {
    if (snapshot.empty) {
      console.log("false");
      
      return res.end("[]");
    }
    
    let arr = [];
    snapshot.forEach((doc) => {
      let data = doc.data();
      data.uid = doc.id;
      arr.push(data);
    });
    return res.end(JSON.stringify(arr));

  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("[]");
  });
}
function existsInsta(req, res) {
  const iid = req.url.replace('/exists_insta/', '').replace('/', '');
  console.log(iid);
  
  db.collection('users').where('instagram.iid', '==', iid).limit(1).get()
  .then((snapshot) => {
    if (snapshot.empty) {
      console.log("false");
      res.end("false");

    } else {
      console.log("true");
      res.end("true");
    }
  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("Err");
  });
}

function loginInsta(req, res){
  const iid = req.url.replace('/login_insta/', '').replace('/', '');
  console.log(iid);
  db.collection('users').where('instagram.iid', '==', iid).limit(1).get()
  .then((snapshot) => {
    if (snapshot.empty) {
      console.log("false");
      
      return res.end("[]");
    }
    
    let arr = [];
    snapshot.forEach((doc) => {
      let data = doc.data();
      data.uid = doc.id;
      arr.push(data);
    });
    return res.end(JSON.stringify(arr));

  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("[]");
  });
}

function addCreds(req, res) {
  let base = req.url.replace("/add_creds/", "").replace("/", "");
  let as_string = Buffer.from(base, 'base64').toString('ascii');
  let as_obj = JSON.parse(as_string);
  console.log(as_obj);
  const user = as_obj.uid;
  const pl = as_obj.pl;

  let creds = {};
  if (!!pl.schueler)
    creds.schueler = pl.schueler;
  if (!!pl.lehrer)
  creds.lehrer = pl.lehrer;

  db.collection('users').doc(user).set({creds: creds}, {merge: true}).then(ref => {
    res.end("Ok");
  }).catch((err) => {
    console.error(err);
    res.end("err");
  });
  
}

function getCreds(req, res) {
  const uid = req.url.replace('/get_creds/', '').replace('/', '');
  console.log(uid);

  db.collection('users').doc(uid).get()
  .then(snap => {
    let data = snap.data();
    res.end(JSON.stringify(data.creds));
  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("null");
  });

}

function setBasics(req, res) {
  let base = req.url.replace("/set_basics/", "").replace("/", "");
  let as_string = Buffer.from(base, 'base64').toString('ascii');
  let as_obj = JSON.parse(as_string);
  console.log(as_obj);
  const user = as_obj.uid;
  const kurse = as_obj.kurse;
  const stufe = as_obj.stufe;

  db.collection('users').doc(user).set({kurse: kurse, stufe: stufe}, {merge: true}).then(ref => {
    res.end("Ok");
  }).catch((err) => {
    console.error(err);
    res.statusCode = 400;
    res.end("err");
  });

}

async function api_getKurseAndTT(req, res){
  
  let base = req.url.replace("/getKurseAndTT/", "").replace("/", "");
  let as_string = Buffer.from(base, 'base64').toString('ascii');
  let as_obj = JSON.parse(as_string);

  try {
    let kurse = await getKurseAndTT(as_obj.stufe, as_obj.stufe_id, as_obj.wochen, as_obj.creds);
    
    // this is needed because at the time writing, the data provided by the server is corrupted
    kurse.tt.forEach((o) => {
      o.days.forEach((t) => {
        t.forEach((h) => {
          if (!!h.raeume)
            h.raeume.forEach((r) => {
              if (!r.raum){
                r.raum = "---";
              }
            });
        });
      });
    });
    let str = JSON.stringify(kurse, null, 2).replace(/type/g, "typ");
    console.log(JSON.stringify(JSON.parse(str)));
    return res.end(str);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    return res.end("error");
  }
  
}

async function getUsersKurse(req, res) {
    const uid = req.url.replace('/users_kurse/', '').replace('/', '');
    console.log(uid);
    try {
        const snap = await db.collection('users').doc(uid).get();
        const data = snap.data();
        if (!!data) {
            const stufe = data.stufe;
            const kurse = data.kurse;
            if (!!kurse)
                return res.end(JSON.stringify({stufe, kurse}));
            else {
                res.statusCode = 402;
                return res.end("Kurse nicht gesetzt");
            }
        }
        else {
            res.statusCode = 401;
            return res.end("Nutzer nicht gefunden");
        }
    } catch (e) {
        console.error(e);
        res.statusCode = 400;
        return res.end(e.message);
    }
}

async function proxy(req, res) {
  let base = req.url.replace("/proxy/", "").replace("/", "");
  let as_string = Buffer.from(base, 'base64').toString('ascii');
  let as_obj = JSON.parse(as_string); // {url: string, method: string, header: {}, payload?: string}

  const resp = await fetch(as_obj.url, {
    headers: as_obj.header,
    method: as_obj.method
  });

  const resp_txt = await resp.textConverted();
  res.statusCode = resp.status;
  return res.end(resp_txt);

}

async function vp(req, res) {
  let base = req.url.replace("/vp/", "").replace("/", "");
  const o = await getVertretungsdaten(base, false, new Date());
  console.log(JSON.stringify(o, null, 2).replace(/type/g, 'typ'));
  return res.end(JSON.stringify(o).replace(/type/g, 'typ'));
}