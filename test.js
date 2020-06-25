/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

var request = require('request'); // "Request" library

var client_id = '878a266c1fb44e9f9e030135f07c6876'; // Your client id
var client_secret = 'f64c8b888d1d40eeabbbf162f6650b2b'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/search?q=eavesdrop&type=track&limit=10',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      // console.log(body);
      // print each track
      for(var i=0;i<10;i++) {
        console.log(body.tracks.items[i].name + " - " + body.tracks.items[i].artists[0].name);
      }
    });
  }
});


// SAMPLE SEARCHES
// get recommendation:
// https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_tracks=0XDjtRaCmupZbkvvmtFIBB%2C7lGKEWMXVWWTt3X71Bv44I%2C5o0bDeEnMMgbjJSZtXsxPI
// search for track:
// https://api.spotify.com/v1/search?q=eavesdrop&type=track&limit=10



// notes:
// url enconding: those percent shits