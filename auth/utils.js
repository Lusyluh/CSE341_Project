const {google} = require('googleapis');
const querystring = require ('querystring');
const google_auth_token_endpoint ='https://accounts.google.com/o/oauth2/v2/auth';

const query_params = {
  client_id: process.env.CLIENT_APP_ID,
  redirect_uri: `http://localhost:8080${process.env.REDIRECT_URI}`,
};
//get access token
const get_access_token = async auth_code => {
  const access_token_params = {
    ...query_params,
    client_secret: process.env.CLIENT_APP_SECRET,
    code: auth_code,
    grant_type: 'authorization_code',
  };
  return await axios ({
    method: 'post',
    url: `${google_access_token_endpoint}?${query_string.stringify (access_token_params)}`,
  });
};

// this objects contains information that will be passed as query params to the auth // token endpoint
  const auth_token_params = {
    ...query_params,
    response_type: 'code'
  };
// the scopes (portion of user's data) we want to access
const scopes = ['profile', 'email', 'openid'];

// a url formed with the auth token endpoint and the
  const request_get_auth_code_url = `${google_auth_token_endpoint}?${new URLSearchParams(auth_token_params)}&scope=${scopes.join (' ')}`;
  
module.exports ={request_get_auth_code_url, get_access_token};