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

  if (/^\/register\/.*$/.test(req.url)) {
    return registerUser(req, res);
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
  console.log(req.url.replace('/existsemail/', '').replace('/', ''));
  
  db.collection('users').where('normal.email', '==', req.url.replace('/existsemail/', '').replace('/', '')).get()
  .then((snapshot) => {
    if (snapshot.empty) {
      console.log("false");
      
      return res.end("false");
    }
    console.log("true");
    
    res.end("true");
  })
  .catch((err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("Err");
  });
}


function verify_email(req, res){
  console.log(req.url.replace('/verify_email/', '').replace('/', ''));
  db.collection('users').where('normal.email', '==', req.url.replace('/verify_email/', '').replace('/', '')).get()
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