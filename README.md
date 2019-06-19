# UltimateGymWue [![Build Status](https://travis-ci.com/FoseFx/UltimateGymWue.svg?token=iq4xczjhn3DVKzpp6yfB&branch=master)](https://travis-ci.com/FoseFx/UltimateGymWue)
The Ultimate Tool for the Students of my School.

## Features

- User Management
  - Email/Password
  - Google OAuth
  - Instagram OAuth
  - Anmeldedaten für Schulserver
- Setup
  - Credentials
  - Stufen
  - Kurse
- Basics
  - Landing Page
  - Stundenplan
  - Popup
    - Verstecken von Nicht-Kursen
## TODO
- Landing / Main
  - Stundenplan
  - Vertretungsplan
- Kalender
- Freunde


## Before running the backend:

1. Make sure you have a firebase project setup. 
2. Download it's `service_account.json` and copy it to `./UGWBackend/db-middleware/service_account.json`
3. Make sure Docker and Docker-compose are installed
4. Run `docker-compose build` and `docker-compose up` with the following environment variables:
    - SECRET - used to sign JWTs
    - MAIL_JET_USER
    - MAIL_JET_KEY
    - REDIS_PATH = `redis://cache:6379/`
    - INSTA_CID
    - INSTA_SECRET
5. Make sure the frontend is hosted somewhere with 404 redirects to `index.html` and points to the backend in `environment.prod.ts`.

### When running in development:
- Make sure you set the correct values in the `main.rs` file
- Make sure you run the backend using `env DEVELOPMENT=true SECRET=AAAA MAIL_JET_USER=AAAA MAIL_JET_KEY=AAAA REDIS_PATH=AAAA INSTA_CID=AAAA INSTA_SECRET=AAAA cargo run` and replace `AAAA`
- Run the db middleware using `env SECRET=AAAA` and replace `AAAA`
- Serve the frontend using `ng serve`


In case you wonder, what this ["docs/ugw-router.xml"](docs/ugw-router.xml) file is. Open it on [draw.io](http://draw.io/)

---

A FoseFx project.
