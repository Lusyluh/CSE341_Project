//imports the axios module to make http/https requests
const axios = require('axios');

let is_logged_in = false;

//get accesstoken from google api
const google_access_token_endpoint = 'https://oauth2.googleapis.com/token';

//get access the authorization token from google console
const google_auth_token_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

//query pamameters to be added to the url
const searchParams = {
  client_id: process.env.CLIENT_APP_ID,
  redirect_uri: `http://localhost:8080${process.env.REDIRECT_URI}`,
};

// this objects contains information that will be passed as query params to the auth // token endpoint
const auth_token_params = {
  ...searchParams,
  response_type: 'code'
};
// the scopes (portion of user's data) we want to access
const scopes = ['profile', 'email', 'openid'];

// a url formed with the auth token endpoint and the
const request_get_auth_code_url = `${google_auth_token_endpoint}?${new URLSearchParams(auth_token_params)}&scope=${scopes.join (' ')}`;

//get access token
const get_access_token = async auth_code => {
  const access_token_params = {
    ...searchParams,
    client_secret: process.env.CLIENT_APP_SECRET,
    code: auth_code,
    grant_type: 'authorization_code',
  };
  return await axios({
    method: 'post',
    url: `${google_access_token_endpoint}?${new URLSearchParams(access_token_params)}`,
  });
};
//use the access token to retrieve user's profile
const get_profile_data = async access_token => {
  return await axios({
    method: 'post',
    url: `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`,
  });
};

module.exports = {
  request_get_auth_code_url,
  get_access_token,
  get_profile_data,
  is_logged_in
};