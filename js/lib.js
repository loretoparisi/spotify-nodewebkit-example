/**
* Spotify NodeWebKit Player Controller
* @author Loreto Parisi (loretoparisi at gmail dot com)
* @2015-2016 Loreto Parisi
*/

/**
* Utilities
*/
var Utils = {
    /**
     * Deep clone object
     */
    deepClone : function(obj) {
      var copy;
      var i;
      var len;

      if (!obj || typeof obj !== 'object') {
          return obj;
      }

      if (obj instanceof Array) {
          copy = [];
          for (i = 0, len = obj.length; i < len; i++) {
              copy[i] = deepClone(obj[i]);
          }
          return copy;
      }

      if (obj instanceof Object) {
          copy = Object.create(obj.constructor.prototype);
          for (var prop in obj) {
              if (obj.hasOwnProperty(prop)) {
                  copy[prop] = deepClone(obj[prop]);
              }
          }
      }

      return copy;
  } //deepClone

} //Utils

/**
 * Basic Logger
 * @2014 musiXmatch Spa
 * @author Loreto Parisi at musixmatch dot com
 */
var Logger = {
    level : false, // true | false
    settings : new Object(),
    setLevel : function(l) {this.level=l;},
    getLevel : function() { return this.level; },
    _print : function(msg,bgc,txc) {
      if(this.getLevel()) {
        if(msg instanceof Object) {
          try {
			  var time = new Date();
			  var msg = "[" + time + "] " + JSON.stringify(msg);
            console.log( msg );
          } catch(e) {
			  var time = new Date();
			  var msg = time + " " + msg;
            console.log( msg );
          }
        } else {
		  var time = new Date();
		  var msg = "[" + time + "] " + msg;
          console.log('%c ' + msg,
             'background:'+bgc+'; color:'+txc+';');
        }
      }
    },
    debug: function(msg) {
      Logger._print(msg,Logger.settings.colorsBg,Logger.settings.colorsDebug);
    },
	  log: function(msg) {
      Logger._print(msg,Logger.settings.colorsBg,Logger.settings.colorsDebug);
    },
    error: function(msg) {
      Logger._print(msg,Logger.settings.colorsBg,Logger.settings.colorsError);
    },
    warn: function(msg) {
      Logger._print(msg,Logger.settings.colorsBg,Logger.settings.colorsWarn);
    },
	clear : function() { console.clear(); },
  toString : function(object) { if(this.getLevel()) console.log( JSON.stringify(object) ); },
	dump : function(object) { if(this.getLevel()) console.log( object); },
  rm : function() {
    function sendError(url,data) {
      var img = newImage(),
          src = url+'&data=' + encodeURIComponent(JSON.stringify(data));

      img.crossOrigin = 'anonymous';
      img.onload = function success() {
          console.log('success', data);
      };
      img.onerror = img.onabort = function failure() {
          console.error('failure', data);
      };
      img.src = src;
    }
  },
  init : function(params) {

       // override system console if not available
       if(typeof(console) === "undefined" || typeof(console.log) === "undefined") {
  			 console = { log: function() { } };
  		}
        if(typeof(params)=='undefined') {
			   params = new Object();
		}
		Logger.settings = {
          debug : true,
          colorsBg : '#FFF',
          colorsDebug : '#3399FF',
          colorsError : '#CC0000',
          colorsWarn : '#FFCC00'
		};
		for(var pkey in params) {
      		Logger.settings[pkey] = params[pkey];
   		}
		Logger.setLevel( Logger.settings.debug );
  }
} //Logger

/**
* A Timer thread
*/
function Timer(target,name,delay,doFirstRun) { // lp: a timer thread

	this.name = (typeof(name)=="string")?name:""; // name
	this.target = (target instanceof Object)?target:null; // underlining runnable
	this.doFirstRun=doFirstRun?doFirstRun:false; // TRUE to do a first run
	this.delay = !isNaN(delay)?delay:5000; // default execution delay [msec]
	this.isAlive = false; // TRUE if is running
	this.intervalId = -1; // thread ID

	var instance = this;

	/*
	 * Subclasses of Thread should override this method to perform actions
	 */
	this.run = function() {
		if(this.target && typeof(this.target.run)!="undefined")
			this.target.run();
	};

	/*
	 *  Causes this thread to begin execution;
	 */
	this.start = function() {
		if(!this.alive()) {
			this.nop(); // sleep for other thread incoming
			if(!this.alive()) { // semaphore
				this.isAlive = true;
				if(this.doFirstRun) this.run(); // do first run
				this.intervalId = setInterval( // fork
					function() {
						instance.run();
					},this.delay,instance);
			}
		}
	};

	/*
	 * Causes the currently executing thread to stop.
	 * This method is unsafe.
	 */
	this.stop = function() {
		if(this.alive()) {
			this.nop(); // sleep for other thread incoming
			if(this.alive()) { // semaphore
				this.isAlive = false;
				clearInterval(this.intervalId);
			}
		}
	};

	/*
	 * Causes the currently executing thread to sleep (temporarily cease execution)
	 * for the specified number of milliseconds.
	 */
	this.sleep = function(value) {
		this.stop(); // stop thread
		var _aTimer = new function() {
			this.base = new Timer(this,"timer");
			this.run = function() { // override run
				var noop="dilada";
				for(var k=0;k<100;k++)
					noop=noop.substring(0,1);
			};
			this.start = function() {
				this.base.start();
			};
			this.stop = function() {
				this.base.stop();
			};
			this.sleep = function(value) {
				this.base.sleep(value);
			};
		};
		_aTimer.start(); // start a timer
		setTimeout(function() { // stop after value msec.
			_aTimer.stop();
			instance.start(); // start thread
		},value);
	};

	/*
	 * Perform a no operation
	 */
	this.nop = function() {
		var noop="dilada";
		for(var k=0;k<1000;k++)
			noop=noop.substring(0,1);
	};

	/*
	 * Tests if this thread is alive.
	 * A thread is alive if it has been started and has not yet died.
	 * @return: TRUE if thread is running
	 */
	this.alive = function() {
		return this.isAlive;
	};

	/*
	 * Changes the name of this thread to be equal to the argument name.
	 * @param value:String
	 */
 	this.setName = function(value) {
		this.name=value;
	};

	/*
	 * Returns this thread's name.
	 * @return String
	 */
	this.getName = function() {
		return this.name;
	};
}
