/**
* Spotify Player Controller
* Support for Node-WebKit and Electron Frameworks
*
* @author Loreto Parisi (loretoparisi at gmail dot com)
* @2015-2016 Loreto Parisi
*/

/**
* Spotify Player
*/
function SpotifyPlayer (spotify,options) {
	this.options = options;
	this.spotify = spotify;
	var self=this;
	this.thread = new Timer(this,"",this.options.interval,true); // timer thread

	/**********
	* Player API
	***********/

	// Player Status
	this.status = function(callback) {
		try {
			this.spotify.getStatus(function (err, res) {
				if (err) {
					return console.error(err);
				}
				callback(res);
			});
		} catch(err) {
			console.log(err);
		}
	} //status
	this.scrobble = function(callback) {
			this.callback=callback;
			this.start();
	} //scrobble
	this.play = function(spotifyUrl,callback) {
		try {
			this.spotify.play(spotifyUrl,function (err, res) {
				if (err) {
					return console.error(err);
				}
				callback(res);
			});
		} catch(err) {
			console.log(err);
		}
	}

	/**********
	* Thread
	***********/

	this.run  = function() {
		this.status(this.callback);
	};
	this.start = function() {
		this.thread.start();
	};
	this.stop = function() {
		this.thread.stop();
	};
	this.isRunning = function() {
		return this.thread.alive();
	};
} // SpotifyPlayer

/**
* User-Interface
*/
function UI() {

	/**
	* @param SpotifyPlayerStatus
	*/
	this.updatePlayerInfo = function(spotifyPlayerStatus) {
		try {
			var playerInfo=spotifyPlayerStatus.data;
			$('.container .trackInfo').append($('<p/>').append($('<span/>')
				.text(playerInfo.playing_position))
			);

		} catch(error) {
				Logger.error(error);
		}
	} //updatePlayerInfo

	/**
	* @param SpotifyTrack
	*/
	this.updateTrackInfo = function(spotifyTrack) {
		try {
			var trackInfo=spotifyTrack.data;
			$('.container .trackInfo').empty();
			$('.container .trackInfo').append($('<span/>')
				.text(trackInfo.track_resource.name)
			).append($('<span/>')
				.text(trackInfo.artit_resource.name)
			);

		} catch(error) {
				Logger.error(error);
		}
	} //updateTrackInfo
	this.update = function(track, playerStatus) {
		this.updateTrackInfo( track );
		this.updatePlayerInfo( playerStatus );
	} //update
} //UI

function AppException(value) {
   this.value = value;
   this.message = "Node-WebKit or Electron not found.";
   this.toString = function() {
      return this.value + this.message;
   };
}

/**********
* Window Common Handlers
***********/

window.onerror = function(msg, url, line, col, error) {
   // Note that col & error are new to the HTML 5 spec and may not be
   // supported in every browser.  It worked for me in Chrome.
   var extra = !col ? '' : '\ncolumn: ' + col;
   extra += !error ? '' : '\nerror: ' + error;

   // You can view the information in an alert to see things working like this:
   alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

   // TODO: Report this error via ajax so you can keep track
   //       of what pages have JS issues

   var suppressErrorAlert = false;
   // If you return true, then error alerts (like in older versions of
   // Internet Explorer) will be suppressed.
   return suppressErrorAlert;
};

/**********
* Interfaces
***********/

var nodeSpotifyWebHelper = require('./node_modules/node-spotify-webhelper');
var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();
var player = new SpotifyPlayer(spotify, { interval: 5000});
var ui = new UI();
Logger.setLevel(true);

/**********
* Web App
***********/

var webapp;
if(typeof(NodeWebKitApp)!='undefined') { //NodeWebKit
	webapp = new NodeWebKitApp();
}
else if(typeof(ElectronApp)!='undefined') { //Electron
	webapp = new ElectronApp();
}
else { // undefined
	throw new AppException(-9001);
}
webapp.load(function() { // app loaded

	player.scrobble(function(res) {

		var track = new SpotifyTrack(res);
		var playerStatus = new SpotifyPlayerStatus(res);

		Logger.dump( track );
		Logger.dump( playerStatus );

		ui.update( track, playerStatus );

	});

},
function() { // app will close

},
function() { // app activated

});
