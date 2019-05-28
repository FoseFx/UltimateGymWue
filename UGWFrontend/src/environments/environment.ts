// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const backendHost = 'http://localhost:8000';
const frontendHost = 'http://localhost:4200';
export const environment = {
  production: false,
  urls: {
    loginNormal: `${backendHost}/api/auth/normal/login`,
    registerNormal: `${backendHost}/api/auth/normal/register`,
    registerGoogle: `${backendHost}/api/auth/google/register`,
    loginGoogle: `${backendHost}/api/auth/google/login`,
    // tslint:disable-next-line:max-line-length
    registerInstaRediect: `https://api.instagram.com/oauth/authorize/?client_id=6adf4502be134725b4208a5273fac0a1&redirect_uri=${frontendHost}/assets/insta-redirect.html&response_type=code`,
    registerInsta: `${backendHost}/api/auth/insta/register-code`,
    loginInsta: `${backendHost}/api/auth/insta/login`,
    addCredentials: `${backendHost}/api/basics/add_creds`,
    fetchCredentials: `${backendHost}/api/basics/get_creds`,
    getStufen: `${backendHost}/api/basics/stufen`,
    getKurse: `${backendHost}/api/basics/kurse`,
    setBasics: `${backendHost}/api/basics`,
    getStundenplan: `${backendHost}/api/basics/stundenplan`,
    getVertretung: `${backendHost}/api/basics/vp/`
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
