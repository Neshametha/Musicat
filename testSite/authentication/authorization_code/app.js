var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var userId, playlistId, globalUris;

var client_id = 'c5d4b17312854a71be53aefa366727e2'; // Your client id
var client_secret = '2d2612613edc4feeaa609df51f345ca0'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public ';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          saveUserId(body.id);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      makePlaylist(access_token, userId);
      res.send({
        'access_token': access_token
      });
    }
  });
});

function saveUserId(u) {
  userId = u;
}

function savePlaylistId(p) {
  playlistId = p;
}

function saveUris(ur) {
  globalUris = ur;
}

function getRecommendations(access_token, emotion) {
  var targetEnergy, targetMode, targetValence;

  switch(emotion) {
    case 'anger':
      targetEnergy = 0.8;
      targetMode = 1;
      targetValence = 0.1;
      break;
    case 'contempt':
      targetEnergy = 0.7;
      targetMode = 0;
      targetValence = 0.1;
      break;
    case 'disgust':
      targetEnergy = 0.7;
      targetMode = 0;
      targetValence = 0.3;
      break;
    case 'fear':
      targetEnergy = 0.5;
      targetMode = 0;
      targetValence = 0.3;
      break;
    case 'happiness':
      targetEnergy = 0.9;
      targetMode = 1;
      targetValence = 0.9;
      break;
    case 'neutral':
      targetEnergy = 0.5;
      targetMode = 1;
      targetValence = 0.5;
      break;
    case 'sadness':
      targetEnergy = 0.1;
      targetMode = 0;
      targetValence = 0.1;
      break;
    case 'surprise':
      targetEnergy = 0.8;
      targetMode = 1;
      targetValence = 0.8;
      break;
    default:
      targetEnergy = 0.5;
      targetMode = 1;
      targetValence = 0.5;
  }
  console.log("Energy: "+targetEnergy)
  console.log("Valence: "+targetValence)
  console.log("Mode: "+targetMode)
  var populateOptions = {
    url: "https://api.spotify.com/v1/recommendations?"
    +"seed_artists=60d24wfXkVzDSfLS6hyCjZ&"
    +"target_valence="+targetValence+"&target_mode="+targetMode
    +"&target_energy="+targetEnergy+"&min_popularity=20&market=US",
    headers: { 
      'Authorization': 'Bearer ' + access_token 
    }
  };
  request.get(populateOptions, function(error, res, body) {
    body = JSON.parse(body)
    var uris = [];
    for(i = 0; i < Object.keys(body.tracks).length; i++) {
      uris.push(body.tracks[i].uri);
    }
    saveUris(uris);
    addToPlaylist(access_token, playlistId, uris);
  })
}

function addToPlaylist(access_token, playlist_id, songs) {
  var playlistOptions = {
    url: "https://api.spotify.com/v1/playlists/"+playlist_id+"/tracks",
    headers: {
      "Authorization": "Bearer "+access_token,
      "Accept": 'application/json'
    },
    body: JSON.stringify({
     uris: songs
    })
  }
  request.post(playlistOptions, function(error, response, body) {
    console.log(body)
  })
}

function makePlaylist(access_token, user_id) {
  var playlistOptions = {
    url: "https://api.spotify.com/v1/users/"+user_id+"/playlists",
    headers: {
      "Accept": 'application/json',
      "Authorization": "Bearer " + access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "Musicat Playlist",
      public: false
    }),
    dataType: 'json'
  }
  request.post(playlistOptions, function(error, res, body) {
    body = JSON.parse(body);
    savePlaylistId(body.id)
    getRecommendations(access_token, 'angry');
  })
}


console.log('Listening on 8888');
app.listen(8888);
