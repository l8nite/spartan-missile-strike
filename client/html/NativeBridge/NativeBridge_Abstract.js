/* NativeBridge_Abstract
 * Abstract class for NativeBridge, the conduit HTML uses to speak to the native
 * client and vice versa. iOS and Android should have separate implementations.
 * 
 * 
 * Public methods:
 * 
 * callback(number identifier, Object arguments)
 *     Called by the native client to return stuff to HTML.
 *     identifier - integer designating the store callback method
 *     arguments - object containing requested valued (ex. { prop_one: val_one,
 *                 prop_two: "val_two" } )
 *                 See Native Bride API for more details.
 * 
 * startLocationUpdates(function callback)
 *     Called by HTML to get location data as it changes.
 *     callback - callback method, takes {latitude, longitude} in degrees
 *     returns a numerical ticket to be used with stopLocationUpdates
 *     
 * stopLocationUpdates(number callbackid)
 *     Called by HTML to stop streaming of location data.
 *     callbackid - callback ticket from startLocationUpdates
 *     
 * startOrientationUpdates(function callback)
 *     Called by HTML to get orientation data as it changes.
 *     callback - callback method, takes {pitch, roll, yaw} in radians
 *     
 * stopOrientationUpdates(number callbackid)
 *     Called by HTML to stop streaming of orientation data.
 *     callbackid - callback ticket from startOrientationUpdates
 *     
 * showFireMissileScreen()
 *     Called by HTML to show fire missile screen i.e. turn on camera
 *     
 * hideFireMissileScreen()
 *     Called by HTML to hide fire missile screen i.e. turn off camera

 * getPreferences(String[] preferences, function callback)
 *     Get specified preference(s) from native client
 *     preferences - array of preferences to get, can accept string of one preference.
 *     callback - callback method, takes hash of preferences
 *     
 * setPreferences(Object preferences, function callback)
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
 * playSound(String soundID, Object options)
 *     Play sound with options
 *     soundID - sound to play
 *     options - {boolean foreground, boolean loop}
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
 * vibrate(number time)
 *     Called by HTML to tell the device to dance
 *     time - milliseconds to vibrate for
 * 
 *
 * Unimplemented methods:
 * (These methods implement the code that generate the events each platform client
 * will intercept. will have differenct implementations depending on platform.)
 * 
 * _startLocationUpdates(number callbackID)
 *     Request location updates through callback() as they change.
 *     callbackID - Callback identifier to pass to callback()
 *
 * _stopLocationUpdates()
 *     Request to stop streaming location updates
 * 
 * _startOrientationUpdates(number callbackID)
 *     Request orientation updates through callback() as they change.
 *     callbackID - Callback identifier to pass to callback()
 *     
 * _stopOrientationUpdates()
 *     Request termination of orientation updates.
 *     
 * showFireMissileScreen()
 *     See "Public methods"
 *     
 * hideFireMissileScreen()
 *     See "Public methods"
 *     
 * _getPreferences(String[] preferences, number callbackID)
 *     Retrieve preferences and return value through callback()
 *     preferences - preferences array to get
 *     callbackID - Callback identifier to pass to callback()
 *     
 * _setPreferences(Object preferences, number callbackID)
 *     Set preferences locally, indicate success through callback()
 *     preferences - Hash of preference key and value to store
 *     callbackID - Callback identifier to pass to callback()
 *     
 * _getFacebookAccessToken(number callbackID)
 *     Request Facebook token through callback()
 *     callbackID - Callback identifier to pass to callback()
 *     
 * logoutFacebook()
 *     See "Public methods"
 *     
 * playSound(String soundID, Object options)
 *     See "Public methods"
 *     
 * stopSound(String soundID)
 *     See "Public methods"
 *     
 * hideSplah()
 *     See "Public methods"
 *     
 * vibrate(number time)
 *     See "Public methods"
 */

function NativeBridge_Abstract() {
	// Holds callback functions
	this._callbacks = new Fridge();
}

//
// Public
//

NativeBridge_Abstract.prototype.callback = function (identifier, response) {
	var stored = this._callbacks.get(identifier);
	if (stored) {
		stored.callback(response);
		if (!stored.persist) {
			this._callbacks.remove(identifier);
		}
	}
};

NativeBridge_Abstract.prototype.startLocationUpdates = function (callback) {
	var that = this;
	if (this._getLocationUpdatesCBs) {
		return this._getLocationUpdatesCBs.add(callback);
	} else {
		this._getLocationUpdatesCBs = new Fridge();
		var id = this._getLocationUpdatesCBs.add(callback);
		this._startLocationUpdates(this._registerCallback(function (response) {
			var a = that._getLocationUpdatesCBs.getAll();
			for (var i in a) {
				a[i](response);
			}
		}, true));
		return id;
	}
};

NativeBridge_Abstract.prototype.stopLocationUpdates = function (callbackid) {
	if (this._getLocationUpdatesCBs) {
		this._getLocationUpdatesCBs.remove(callbackid);
		if (this._getOrientationUpdatesCBs.count() === 0) {
			delete this._getLocationUpdatesCBs;
			this._stopLocationUpdates();
		}
	}
};

NativeBridge_Abstract.prototype.startOrientationUpdates = function (callback) {
	var that = this;
	if (this._getOrientationUpdatesCBs) {
		return this._getOrientationUpdatesCBs.add(callback);
	} else {
		this._getOrientationUpdatesCBs = new Fridge();
		var id = this._getOrientationUpdatesCBs.add(callback);
		this._startOrientationUpdates(this._registerCallback(function (response) {
			var a = that._getOrientationUpdatesCBs.getAll();
			for (var i in a) {
				a[i](response);
			}
		}, true));
		return id;
	}
};

NativeBridge_Abstract.prototype.stopOrientationUpdates = function (callbackid) {
	if (this._getOrientationUpdatesCBs) {
		this._getOrientationUpdatesCBs.remove(callback);
		if (this._getOrientationUpdatesCBs.count() === 0) {
			delete this._getOrientationUpdatesCBs;
			this._stopOrientationUpdates();
		}
	}
};

NativeBridge_Abstract.prototype.getPreferences = function (preferences, callback) {
	if (typeof preferences === "string") {
		preferences = [preferences];
	}
	this._getPreferences(preferences, this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.setPreferences = function (preferences, callback) {
	this._setPreferences(preferences, this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.getFacebookAccessToken = function (callback) {
	this._getFacebookAccessToken(this._registerCallback(callback));
};

//
// Private
//

// Save callback function, returns callbackID
// persist can be undefined :)
NativeBridge_Abstract.prototype._registerCallback = function (callbackFn, persist) {
	return this._callbacks.add({
			callback : callbackFn,
			persist : persist
	});
};
