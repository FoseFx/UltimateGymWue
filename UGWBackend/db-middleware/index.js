const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const http = require("http");

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