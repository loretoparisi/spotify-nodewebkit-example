/**
* Spotify Player Controller
* Support for Node-WebKit and Electron Frameworks
*
* @author Loreto Parisi (loretoparisi at gmail dot com)
* @2015-2016 Loreto Parisi
*/

/**

Spotify Track Model

{
"track_resource": {
    "name": "Drifting",
    "uri": "spotify:track:4zRdmcE23a3LTVBTH1TtlP",
    "location": {
        "og": "https://open.spotify.com/track/4zRdmcE23a3LTVBTH1TtlP"
    }
},
"artist_resource": {
    "name": "G-Eazy",
    "uri": "spotify:artist:02kJSzxNuaWGqwubyUba0Z",
    "location": {
        "og": "https://open.spotify.com/artist/02kJSzxNuaWGqwubyUba0Z"
    }
},
"album_resource": {
    "name": "Drifting",
    "uri": "spotify:album:0qOn1wYksu2qoMcaF33Yj0",
    "location": {
        "og": "https://open.spotify.com/album/0qOn1wYksu2qoMcaF33Yj0"
    }
},
"length": 273,
"track_type": "explicit"
}

*/
function SpotifyTrack(data) {
  this.map = function(data) {
    this.data=data;
  } //map
  this.toString = function() {
    return JSON.stringify(this.data);
  } //toString

  this.data=null;
  if(data&&data.track) {
      this.data=data.track;
      this.map(this.data);
  }
} //SpotifyTrack

/**
* Spotify Player Status

  {
    "version": 9,
    "client_version": "",
    "playing": true,
    "shuffle": true,
    "repeat": false,
    "play_enabled": true,
    "prev_enabled": true,
    "next_enabled": true,
    "context": {},
    "playing_position": 0,
    "server_time": 1453122458,
    "volume": 1,
    "online": true,
    "open_graph_state": {
        "private_session": false,
        "posting_disabled": true
    },
    "running": true
  }

*/
function SpotifyPlayerStatus(data) {
  this.map = function(data) {
    this.data=data;
  } //map
  this.toString = function() {
    return JSON.stringify(this.data);
  } //toString
  this.data=null;
  if(data) {
      //delete data.track;
      this.data=data;
      this.map(this.data);
  }
} //SpotifyPlayerStatus
