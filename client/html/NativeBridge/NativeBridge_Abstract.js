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
 * onMainMenu()
 *     Called by native client to check if we're on the main menu.
 *     Native client is called with the response asynchronously.
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

NativeBridge_Abstract.prototype.getLocationUpdates = function (activate, callback) {
	var that = this;
	if (activate) {
		if (this._getLocationUpdatesCBs) {
			return this._getLocationUpdatesCBs.add(callback);
		} else {
			this._getLocationUpdatesCBs = new Fridge();
			var id = this._getLocationUpdatesCBs.add(callback);
			this._getLocationUpdates(true, this._registerCallback(function (response) {
				var a = that._getLocationUpdatesCBs.getAll();
				for (var i in a) {
					a[i](response);
				}
			}, true));
			return id;
		}
	} else {
		if (this._getLocationUpdatesCBs) {
			this._getLocationUpdatesCBs.remove(callback);
			if (this._getLocationUpdatesCBs.count() === 0) {
				delete this._getLocationUpdatesCBs;
				this._getLocationUpdates(false);
			}
		}
	}
};

NativeBridge_Abstract.prototype.getOrientationUpdates = function (activate, callback) {
	var that = this;
	if (activate) {
		if (this._getOrientationUpdatesCBs) {
			return this._getOrientationUpdatesCBs.add(callback);
		} else {
			this._getOrientationUpdatesCBs = new Fridge();
			var id = this._getOrientationUpdatesCBs.add(callback);
			this._getOrientationUpdates(true, this._registerCallback(function (response) {
				var a = that._getOrientationUpdatesCBs.getAll();
				for (var i in a) {
					a[i](response);
				}
			}, true));
			return id;
		}
	} else {
		if (this._getOrientationUpdatesCBs) {
			this._getOrientationUpdatesCBs.remove(callback);
			if (this._getOrientationUpdatesCBs.count() === 0) {
				delete this._getOrientationUpdatesCBs;
				this._getOrientationUpdates(false);
			}
		}
	}
};

NativeBridge_Abstract.prototype.getCurrentLocation = function (callback) {
	this._getCurrentLocation(this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.getPreference = function (preference, callback) {
	this._getPreference(preference, this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.setPreference = function (preferences, callback) {
	this._setPreference(preferences, this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.getFacebookAccessToken = function (callback) {
	this._getFacebookAccessToken(this._registerCallback(callback));
};

NativeBridge_Abstract.prototype.onMainMenu = function () {
	this._onMainMenu(Imports.ViewManager.onInitialView());
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