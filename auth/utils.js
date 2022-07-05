const {google} = require('googleapis');
const querystring = require ('querystring');
const google_auth_token_endpoint ='https://accounts.google.com/o/oauth2/v2/auth';
const query_params = {
  client_id: process.env.CLIENT_APP_ID,
  redirect_uri: `http://localhost:8080${process.env.REDIRECT_URI}`,
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
  //console.log(request_get_auth_code_url);
  
module.exports ={request_get_auth_code_url}