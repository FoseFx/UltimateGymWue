# UltimateGymWue [![Build Status](https://travis-ci.com/FoseFx/UltimateGymWue.svg?token=iq4xczjhn3DVKzpp6yfB&branch=master)](https://travis-ci.com/FoseFx/UltimateGymWue)
The Ultimate Tool for the Students of my School.

## Features

## Before running the backend:

1. Make sure you have a firebase project setup. 
2. Download it's `service_account.json` and copy it to `./UGWBackend/db-middleware/service_account.json`
3. Make sure Docker and DOcker-compose is installed
4. Run `docker-compose build` and `docker-compose up` with the following environment variables:
    - SECRET - used to sign JWTs
    - MAIL_JET_USER
    - MAIL_JET_KEY
    - REDIS_PATH = `redis://cache:6379/`
    - INSTA_CID
    - INSTA_SECRET
5. Make sure the frontend is hosted somewhere with 404 redirects to `index.html` and pointing to the backend.

---

A FoseFx project.
