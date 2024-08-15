// auth.js
const GOOGLE_CLIENT_ID = '690452582391-rest3gld80jsrmqqslrg2v7b280lp2u7.apps.googleusercontent.com';
const REDIRECT_URL = 'http://localhost:8001/callback';
const RESPONSE_TYPE = 'code';
const SCOPE = 'profile email';

export const googleLoginHandler = () => {
  window.location.href =
    `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
};
