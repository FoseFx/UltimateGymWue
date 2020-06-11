# UltimateGymWue [![Build Status](https://travis-ci.com/FoseFx/UltimateGymWue.svg?token=iq4xczjhn3DVKzpp6yfB&branch=master)](https://travis-ci.com/FoseFx/UltimateGymWue) [![codecov](https://codecov.io/gh/FoseFx/UltimateGymWue/branch/master/graph/badge.svg?token=4elcNKyOMX)](https://codecov.io/gh/FoseFx/UltimateGymWue)  [![cypress](https://img.shields.io/static/v1.svg?label=end%202%20end%20tests&message=Cypress&color=blue)](https://travis-ci.com/FoseFx/UltimateGymWue)
The Ultimate Tool for the Students of my School.

# Post Mortem
This project is now unmaintained. A demo is available [here](https://fosefx.github.io/Project-Demos/UGW/index.html).

## Before running the backend:

1. Make sure you have a firebase project setup. 
2. Download it's `service_account.json` and copy it to `./UGWBackend/db-middleware/service_account.json`
3. Make sure Docker and Docker-compose are installed
4. Run `cd UGWBackend && docker-compose build` and `docker-compose up` with the following environment variables:
    - SECRET - used to sign JWTs
    - MAIL_JET_USER
    - MAIL_JET_KEY
    - REDIS_PATH = `redis://cache:6379/`
    - INSTA_CID
    - INSTA_SECRET
5. Edit `UGWFrontend/src/environments/environment.prod.ts` to replace `pushPublicKey` with the VAPID PUBLIC KEY you see as output. Make sure the URLs point to your backend.
6. run `ng build --prod` 
7. Make sure the frontend (in `UGW/Frontend/dist`) is hosted somewhere with 404 redirects to `index.html`..

## When running in development:
- Make sure you set the correct values in the `main.rs` file
- Make sure you run the backend using `env DEVELOPMENT=true SECRET=AAAA MAIL_JET_USER=AAAA MAIL_JET_KEY=AAAA REDIS_PATH=AAAA INSTA_CID=AAAA INSTA_SECRET=AAAA cargo run` and replace `AAAA`
- Run the db middleware using `env SECRET=AAAA` and replace `AAAA`
- Serve the frontend using `ng serve`


Open ["docs/ugw-router.xml"](docs/ugw-router.xml) on [draw.io](http://draw.io/)

