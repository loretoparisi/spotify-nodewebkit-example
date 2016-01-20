/**
* Spotify NodeWebKit Player Controller
* @author Loreto Parisi (loretoparisi at gmail dot com)
* @2015-2016 Loreto Parisi
*/

var nodeSpotifyWebHelper = require('node-spotify-webhelper');
var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();

// get the name of the song which is currently playing
spotify.getStatus(function (err, res) {
  if (err) {
    return console.error(err);
  }

  console.info('currently playing:',
    res.track.artist_resource.name, '-',
    res.track.track_resource.name);
});
