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
 * resumeGame()
 *     Called by native client with no argument to notify HTML that we have
 *     returned from suspension.
 *
 * setResumeHandler(function fx)
 *     Called by HTML with function as argument to register what to do
 *     when resumed!
 * 
 * getLocationUpdates(boolean activate, function callback)
 *     Called by HTML to get location data as it changes.
 *     activate - de/activate the updates
 *     callback - callback method, takes {latitude, longitude} in degrees
 *     
 * getOrientationUpdates(boolean activate, function callback)
 *     Called by HTML to get orientation data as it changes.
 *     activate - de/activate the updates
 *     callback - callback method, takes {pitch, roll, yaw} in radians
 *     
 * getCurrentLocation(function callback)
 *     Called by HTML to get current location
 *     callback - callback method, takes {latitude, longitude} in degrees
 *     
 * showFireMissileScreen(boolean activate)
 *     Called by HTML when showing/hiding fire missile screen
 *     activate - show/hide screen
 *     
 * getPreference(String preference, function callback)
 *     Get specific preference from native client
 *     preference - preference to get
 *     callback - callback method, takes preference
 *     
 * setPreference(Object preference, function callback)
 *     Set one or multiple persisting preferences
 *     preferences - Hash of preference key and value to store
 *     callback - callback method, takes {boolean suceeded}
 *     
 * getFacebookAccessToken(function callback)
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
 * _getLocationUpdates(boolean activate, int callbackID)
 *     Request location updates through callback() as they change.
 *     activate - de/activate the updates
 *     callbackID - Callback identifier to pass to callback()
 * 
 * _getOrientationUpdates(boolean activate, int callbackID)
 *     Request orientation updates through callback() as they change.
 *     activate - de/activate the updates
 *     callbackID - Callback identifier to pass to callback()
 *     
 * _getCurrentLocation(int callbackID)
 *     Request current location through callback().
 *     callbackID - Callback identifier to pass to callback()
 *     
 * showFireMissileScreen(boolean activate)
 *     See "Public methods"
 *     
 * _getPreference(String preference, int callbackID)
 *     Retrieve preference and return value through callback()
 *     preference - preference to get
 *     callbackID - Callback identifier to pass to callback()
 *     
 * _setPreference(Object preferences, int callbackID)
 *     Set preferences locally, indicate success through callback()
 *     preferences - Hash of preference key and value to store
 *     callbackID - Callback identifier to pass to callback()
 *     
 * _getFacebookAccessToken(int callbackID)
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
	// Holds callback functions
	this._callbacks = new Array();
	this._lowestAvailableCallbackID = 0;
	
	// Callback IDs for persistent this._callbacks
	this._resumeGameCallbackID = null;
	this._locationCallbackID = null;
	this._orientationCallbackID = null;
}

//
// Public
//

NativeBridge_Abstract.prototype.callback = function(identifier, response) {
	if (this._callbacks[identifier]) {
		this._callbacks[identifier].callback(response);
		if (!this._callbacks[identifier].persist) {
			delete this._callbacks[identifier];
			if (identifier < this._lowestAvailableCallbackID)
				this._lowestAvailableCallbackID = identifier;
		}
	}
};

NativeBridge_Abstract.prototype.resumeGame = function() {
	this.callback(this._resumeGameCallbackID);
};

NativeBridge_Abstract.prototype.setResumeHandler = function(fx) {
	if (this._resumeGameCallbackID)
		delete this._callbacks[this._resumeGameCallbackID];
	this._resumeGameCallbackID = this._registerCallback(fx, true);
};

NativeBridge_Abstract.prototype.getLocationUpdates = function(activate, callback) {
	if (activate) {
		if (this._locationCallbackID)
			delete this._callbacks[this._locationCallbackID];
		this._locationCallbackID = this._registerCallback(callback, true);
		this._getLocationUpdates(true, this._locationCallbackID);
	}
	else
		this._getLocationUpdates(false);
};

NativeBridge_Abstract.prototype.getOrientationUpdates = function(activate, callback) {
	if (activate) {
		if (this._orientationCallbackID)
			delete this._callbacks[this._orientationCallbackID];
		this._orientationCallbackID = this._registerCallback(callback, true);
		this._getOrientationUpdates(true, this._orientationCallbackID);
	}
	else
		this._getOrientationUpdates(false);
};

NativeBridge_Abstract.prototype.getCurrentLocation = function(callback) {
	this._getCurrentLocation(this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.getPreference = function(preference, callback) {
	this._getPreference(preference, this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.setPreference = function(preferences, callback) {
	this._setPreference(preferences, this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.getFacebookAccessToken = function(callback) {
	this._getFacebookAccessToken(this._registerCallback(callback));
};


//
// Private
//

// Save callback function, returns callbackID
// persist can be undefined :)
NativeBridge_Abstract.prototype._registerCallback = function(callbackFn, persist) {
	this._callbacks[this._lowestAvailableCallbackID] = {
			callback : callbackFn,
			persist : persist
	};
	var thisID = this._lowestAvailableCallbackID;
	// Increment index to next available slot in array
	while (this._callbacks[++this._lowestAvailableCallbackID])
		;
	return thisID;
};