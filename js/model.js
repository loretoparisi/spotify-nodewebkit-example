/**
* Spotify Player Controller
* Support for Node-WebKit and Electron Frameworks
*
* @author Loreto Parisi (loretoparisi at gmail dot com)
* @2015-2016 Loreto Parisi
*/

/**
* Base object model
*/
function SpotifyObject(data) {

  this.name=""
  this.uri=""
  this.location=""
  this.data=data;
  this.toString = function() {
    return JSON.stringify(this.data);
  } //toString

} //SpotifyObject

/**

  Spotify Artist Model

  track : {
      "artist_resource": {
          "name": "G-Eazy",
          "uri": "spotify:artist:02kJSzxNuaWGqwubyUba0Z",
          "location": {
              "og": "https://open.spotify.com/artist/02kJSzxNuaWGqwubyUba0Z"
          }
      }
    }
*/
function SpotifyArtist(data) {
  this.map = function(data) {
    this.data=data.track;
    try {
      this.name=this.data.artist_resource.name
      this.uri=this.data.artist_resource.uri
      this.location=this.data.artist_resource.location.og
    } catch(error) {}
  } //map
}
SpotifyArtist.prototype = SpotifyObject.prototype;        // Set prototype to SpotifyObject's
SpotifyArtist.prototype.constructor = SpotifyArtist;   // Set constructor back to SpotifyAlbum

/**

  Spotify Album Model

  track: {
      "album_resource": {
          "name": "Drifting",
          "uri": "spotify:album:0qOn1wYksu2qoMcaF33Yj0",
          "location": {
              "og": "https://open.spotify.com/album/0qOn1wYksu2qoMcaF33Yj0"
          }
      }
    }
*/
function SpotifyAlbum(data) {
  this.map = function(data) {
    this.data=data.track;
    try {
      this.name=this.data.album_resource.name
      this.uri=this.data.album_resource.uri
      this.location=this.data.album_resource.location.og
    } catch(error) {}
  } //map
}
SpotifyAlbum.prototype = SpotifyObject.prototype;        // Set prototype to SpotifyObject's
SpotifyAlbum.prototype.constructor = SpotifyAlbum;   // Set constructor back to SpotifyAlbum

/**

Spotify Track Model

track : {
  "track_resource": {
      "name": "Drifting",
      "uri": "spotify:track:4zRdmcE23a3LTVBTH1TtlP",
      "location": {
          "og": "https://open.spotify.com/track/4zRdmcE23a3LTVBTH1TtlP"
      }
  },
  "length": 273,
  "track_type": "explicit"
  }

*/
function SpotifyTrack(data) {
  this.artist=null;
  this.album=null;
  this.length="";
  this.type="";
  this.map = function(data) {
    this.artist=new SpotifyArtist();
    this.artist.map(data);
    this.album=new SpotifyAlbum();
    this.album.map(data);
    this.data=data.track;
    try {
      this.name=this.data.track_resource.name;
      this.uri=this.data.track_resource.uri;
      this.location=this.data.track_resource.location.og;
      this.length=this.data.length;
      this.type=this.data.track_type;
    } catch(error) {}
  } //map
} //SpotifyTrack
SpotifyTrack.prototype = SpotifyObject.prototype;        // Set prototype to SpotifyObject's
SpotifyTrack.prototype.constructor = SpotifyTrack;   // Set constructor back to SpotifyAlbum

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
