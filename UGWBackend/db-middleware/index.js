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

  if (/^\/register\/.*$/.test(req.url)) {
    return registerUser(req, res);
  }
    

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