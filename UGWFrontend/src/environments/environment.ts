// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const backendHost = 'https://backend.development';
export const environment = {
  production: false,
  urls: {
    loginNormal: `${backendHost}/api/auth/normal/login`,
    registerNormal: `${backendHost}/api/auth/normal/register`,
    registerGoogle: `${backendHost}/api/auth/google/register`,
    loginGoogle: `${backendHost}/api/auth/google/login`,
    registerInstaRediect: `https://api.instagram.com/oauth/authorize/?client_id=6adf4502be134725b4208a5273fac0a1&redirect_uri=${backendHost}/api/auth/insta/register-redirect&response_type=code`,
    registerInsta: `${backendHost}/api/auth/insta/register-code`,
    loginInsta: `${backendHost}/api/auth/insta/login`,
    addCredentials: `${backendHost}/api/basics/add_creds`,
    fetchCredentials: `${backendHost}/api/basics/get_creds`
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
