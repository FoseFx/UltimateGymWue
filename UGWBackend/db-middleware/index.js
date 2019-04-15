const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const http = require("http");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

http.createServer((req, res) => {

    

    res.end();
}).listen(8080, () => {
    console.log("DB Middleware server listening on port 8080");
});