/**
* Spotify NodeWebKit App
* Based on nwjs v0.12.3
* @author Loreto Parisi (loretoparisi at gmail dot com)
* @2015-2016 Loreto Parisi
*/

var gui = require('nw.gui');

/**
* Basic Web app Interface
*/
function WebApp() {
  this.window=null;
}

/**
* Node WebKit App
*/
function NodeWebKitApp() {
  // Load App
	this.load = function(appDidLoad,appWillClose,appDidActivate) {
		var jsonConfig = require('./package.json');

		console.log(jsonConfig.version);

		// What platform you're running on: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
		console.log('Platform: ' + process.platform);

		// keep app data through reloads
		var App = new Object();
		App.isLoaded = false;
		App.platform=process.platform;

		// GUI

		var win = gui.Window.get();
    this.window = win;
    // bring window to front when open via terminal
    gui.Window.get().focus();

		// menu
		var menu = new gui.Menu({type:"menubar"});

		if( App.platform == "darwin" ) { // MacOS
			menu.createMacBuiltin( jsonConfig.app['display_name'] );
		} // MacOS

		this.showDevTools();
    this.showTray();

		// buggy: https://github.com/nwjs/nw.js/issues/2926
		var eventsNewWinPolicy = function(frame, url, policy) {
			console.log("navigate to "+url);
			policy.ignore();
			if ( jsonConfig.app['url_open_external'] ) {
				gui.Shell.openExternal( url );
			}
		};
		var eventsOnClose = function() {
			appWillClose();
			this.hide(); // Pretend to be closed already
			console.log("App closed");
			this.hide();
			// If the new window is still open then close it.
			if (win != null) win.close(true);
			// After closing the new window, close the main window.
			this.close(true);
		};
		var eventsOnFocus = function() {
			console.log('App frontmost');
			appDidActivate();
		};
		win.on('loaded', function() {
			console.log("App loaded " + App.isLoaded);
			if( !App.isLoaded ) {
				// register events
				win.once('close', eventsOnClose);
				win.once('focus', eventsOnFocus);
				win.once('new-win-policy', eventsNewWinPolicy);
				appDidLoad();
			}
			App.isLoaded=true;

		});
	} // load
	this.showDevTools = function() {
		this.window.showDevTools();
	}//showDevTools
  this.showTray = function() {
    // Create a tray icon
    var tray = new gui.Tray({
      title: 'Tray',
      icon: 'assets/icon_spotify_tray_19.png'
    });
    // Give it a menu
    var menu = new gui.Menu();
    menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
    tray.menu = menu;
  } //showTray
  // NW.JS Notification
  this.showNotification = function (icon, title, body) {
    if (icon && icon.match(/^\./)) {
      icon = icon.replace('.', 'file://' + process.cwd());
    }

    var notification = new Notification(title, {icon: icon, body: body});

    notification.onclick = function () {
      console.log("Notification clicked " + title);
    };
    notification.onclose = function () {
      gui.Window.get().focus();
    };
    notification.onshow = function () {
      console.log("Showed notification " + title);
    };
    return notification;
  } //showNotification

} //NodeWebKitApp
NodeWebKitApp.prototype = WebApp.prototype;        // Set prototype to WebApp's
NodeWebKitApp.prototype.constructor = NodeWebKitApp;   // Set constructor back to NodeWebKitApp

function ElectronApp() {

} //ElectronApp
ElectronApp.prototype = WebApp.prototype;        // Set prototype to WebApp's
ElectronApp.prototype.constructor = ElectronApp;   // Set constructor back to ElectronApp
