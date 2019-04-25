// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urls: {
    registerNormal: 'https://backend.development/api/auth/normal/register',
    loginNormal: 'https://backend.development/api/auth/normal/login',
    registerGoogle: 'http://localhost:8000/api/auth/google/register',
    loginGoogle: 'http://localhost:8000/api/auth/google/login',
    registerInstaRediect: 'https://api.instagram.com/oauth/authorize/?client_id=6adf4502be134725b4208a5273fac0a1&redirect_uri=https://backend.development/api/auth/insta/register-redirect&response_type=code',
    registerInsta: 'https://backend.development/api/auth/insta/register-code',
    loginInsta: 'https://backend.development/api/auth/insta/login',
    addCredentials: 'http://localhost:8000/api/basics/add_creds'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
