/* NativeBridge_Abstract
 * Abstract class for NativeBridge, the conduit HTML uses to speak to the native
 * client and vice versa. iOS and Android should have separate implementations.
 * 
 * 
 * Public methods:
 * 
 * callback(int identifier, Object arguments)
 *     Called by the native client to return stuff to HTML.
 *     identifier - integer designating the store callback method
 *     arguments - object containing requested valued (ex. { prop_one: val_one,
 *                 prop_two: "val_two" } )
 *                 See Native Bride API for more details.
 * 
 * resumeGame(function func)
 *     Called by native client with no argument to notify HTML that we have
 *     returned from suspension.
 *     Also called by HTML with function as argument to register what to do
 *     when resumed!
 * 
 * subscribeLocation(boolean activate, function callback)
 *     Called by HTML to get location data as it changes.
 *     activate - de/activate the updates
 *     callback - callback method, takes {latitude, longitude} in degrees
 *     
 * subscribeOrientation(boolean activate, function callback)
 *     Called by HTML to get orientation data as it changes.
 *     activate - de/activate the updates
 *     callback - callback method, takes {pitch, roll, yaw} in radians
 *     
 * getLocation(function callback)
 *     Called by HTML to get current location
 *     callback - callback method, takes {latitude, longitude} in degrees
 *     
 * showFireMissileScreen(boolean activate)
 *     Called by HTML when showing/hiding fire missile screen
 *     activate - show/hide screen
 *     
 * getLocalPreference(String preference, function callback)
 *     Get specific preference from native client
 *     preference - preference to get
 *     callback - callback method, takes {*preference*}
 *     
 * setLocalPreference(Object preferences, function callback)
 *     Set one or multiple persisting preferences
 *     preferences - Hash of preference keys and values to store
 *     callback - callback method, takes {boolean suceeded}
 *     
 * getFacebookToken(function callback)
 *     Get Facebook access token
 *     callback -  callback method, takes {String token}
 *     
 * logoutFacebook()
 *     Invalidate FB session
 *     
 * playSound(Object options)
 *     Play sound with options
 *     options - {String soundID, boolean foreground, boolean loop}
 *         soundID - sound to play
 *         foreground - play in foreground/background
 *         loop - loop sound/play once
 *         
 * stopSound(String soundID)
 *     Immediately stop sound from looping
 *     soundID - sound to stop playing
 *     
 * hideSplash()
 *     Called by HTML to indicate that it is finished loading and is safe to hide
 *     splash
 *     
 * vibrate(int time)
 *     Called by HTML to tell the device to dance
 *     time - milliseconds to vibrate for
 *     
 * 
 * Unimplemented methods:
 * 
 * getLocationUpdates(boolean activate, int callbackID)
 *     Request location updates through callback() as they change.
 *     activate - de/activate the updates
 *     callbackID - Callback identifier to pass to callback()
 * 
 * getOrientationUpdates(boolean activate, int callbackID)
 *     Request orientation updates through callback() as they change.
 *     activate - de/activate the updates
 *     callbackID - Callback identifier to pass to callback()
 *     
 * getCurrentLocation(int callbackID)
 *     Request current location through callback().
 *     callbackID - Callback identifier to pass to callback()
 *     
 * showFireMissileScreen(boolean activate)
 *     See "Public methods"
 *     
 * getPreference(String preference, int callbackID)
 *     Retrieve preference and return value through callback()
 *     preference - preference to get
 *     callbackID - Callback identifier to pass to callback()
 *     
 * setPreference(Object preferences, int callbackID)
 *     Set preferences locally, indicate success through callback()
 *     preferences - Hash of preference keys and values to store
 *     callbackID - Callback identifier to pass to callback()
 *     
 * getFacebookAccessToken(int callbackID)
 *     Request Facebook token through callback()
 *     callbackID - Callback identifier to pass to callback()
 *     
 * logoutFacebook()
 *     See "Public methods"
 *     
 * playSound(Object options)
 *     See "Public methods"
 *     
 * stopSound(String soundID)
 *     See "Public methods"
 *     
 * hideSplah()
 *     See "Public methods"
 *     
 * vibrate(int time)
 *     See "Public methods"
 */

function NativeBridge_Abstract() {
	
	//
	// Public
	//
	
	this.callback = function(identifier, response) {
		if (callback[identifier]) {
			callbacks[identifier].callback(response);
			if (!callbacks[identifier].persist])
				delete callbacks[identifier];
		}
	};
	
	this.resumeGame = function(fx) {
		if (fx) {
			if (resumeGameCallbackID)
				delete callbacks[resumeGameCallbackID];
			resumeGameCallbackID = registerCallback(fx, true);
		}
		else
			this.callback(resumeGameCallbackID);
	};
	
	this.subscribeLocation = function(activate, callback) {
		if (activate) {
			if (subscribeLocationCallbackID)
				delete callbacks[subscribeLocationCallbackID];
			subscribeLocationCallbackID = registerCallback(callback, true);
			this.getLocationUpdates(true, subscribeLocationCallbackID);
		}
		else
			this.getLocationUpdates(false);
	};
	
	this.subscribeOrientation = function(activate, callback) {
		if (activate) {
			if (subscribeOrientationCallbackID)
				delete callbacks[subscribeOrientationCallbackID];
			subscribeOrientationCallbackID = registerCallback(callback, true);
			this.getOrientationUpdates(true, subscribeOrientationCallbackID);
		}
		else
			this.getOrientationUpdates(false);
	};
	
	this.getLocation = function(callback) {
		this.getCurrentLocation(registerCallback(callback));
	};
	
	this.getLocalPreference = function(preference, callback) {
		this.getPreference(preference, registerCallback(callback));
	};
	
	this.setLocalPreference = function(preferences, callback) {
		this.setPreference(preferences, registerCallback(callback));
	};
	
	this.getFacebookToken = function(callback) {
		this.getFacebookAccessToken(registerCallback(callback));
	};
	
	
	//
	// Private
	//
	
	// Save callback function, returns callbackID
	// persist can be undefined :)
	var registerCallback = function(callbackFn, persist) {
		if (callbackFn) {
			return callbacks.push({
				callback : callbackFn,
				persist : persist
			}) - 1;
		}
	};
	
	// Holds callback functions
	var callbacks = new Array();
	
	var resumeGameCallbackID;
	var subscribeLocationCallbackID;
	var subscribeOrientationCallbackID;
}