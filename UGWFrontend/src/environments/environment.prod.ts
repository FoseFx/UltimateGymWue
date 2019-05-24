const backendHost = 'https://ugw-api.fosefx.com';
const frontendHost = 'https://ugw.fosefx.com';
export const environment = {
  production: true,
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
