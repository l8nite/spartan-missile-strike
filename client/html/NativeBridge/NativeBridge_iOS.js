/* NativeBridge_iOS
 * iOS implementation of NativeBridge_Abstract.
 * Must implement all methods required by NativeBride_Abstract!
 */

function NativeBridge_iOS() {
	NativeBridge_Abstract.call(this);
}

NativeBridge_iOS.prototype = Object.create(NativeBridge_Abstract.prototype);

NativeBridge_iOS.prototype._startLocationUpdates = function (callbackID) {
	this._appendIframe("spartan-missile-strike://startLocationUpdates/?arguments="
		+ JSON.stringify({
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype._stopLocationUpdates = function () {
	this._appendIframe("spartan-missile-strike://stopLocationUpdates/?arguments=");
};

NativeBridge_iOS.prototype._startOrientationUpdates = function (callbackID) {
	this._appendIframe("spartan-missile-strike://startOrientationUpdates/?arguments="
		+ JSON.stringify({
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype._stopOrientationUpdates = function () {
	this._appendIframe("spartan-missile-strike://stopOrientationUpdates/?arguments=");
};

NativeBridge_iOS.prototype.showFireMissileScreen = function () {
	this._appendIframe("spartan-missile-strike://showFireMissileScreen/?arguments=");
};

NativeBridge_iOS.prototype.hideFireMissileScreen = function () {
	this._appendIframe("spartan-missile-strike://hideFireMissileScreen/?arguments=");
};

NativeBridge_iOS.prototype._getPreferences = function (preferences, callbackID) {
	this._appendIframe("spartan-missile-strike://getPreference/?arguments="
		+ JSON.stringify({
			preferences : preferences,
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype._setPreferences = function (preferences, callbackID) {
	this._appendIframe("spartan-missile-strike://setPreference/?arguments="
		+ JSON.stringify({
			preferences : preferences,
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype._getFacebookAccessToken = function (callbackID) {
	this._appendIframe("spartan-missile-strike://getFacebookAccessToken/?arguments="
		+ JSON.stringify({
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype.logoutFacebook = function () {
	this._appendIframe("spartan-missile-strike://logoutFacebook/?arguments=");
};

NativeBridge_iOS.prototype._playSound = function (soundID, options) {
	if (!options) {
		options = {};
	}
	options.soundID = soundID;
	this._appendIframe("spartan-missile-strike://playSound/?arguments="
		+ JSON.stringify(options)
	);
};

NativeBridge_iOS.prototype.stopSound = function (soundID) {
	this._appendIframe("spartan-missile-strike://stopSound/?arguments="
		+ JSON.stringify({
			soundID : soundID
		})
	);
};

NativeBridge_iOS.prototype.hideSplash = function () {
	this._appendIframe("spartan-missile-strike://hideSplash/?arguments=");
};

NativeBridge_iOS.prototype.vibrate = function (time) {
	this._appendIframe("spartan-missile-strike://vibrate/?arguments="
		+ JSON.stringify({
			duration : time
		})
	);
};

NativeBridge_iOS.prototype._appendIframe = function (src) {
	var iframe = document.createElement("iframe");
	iframe.style.display = "none";
	iframe.src = src;
	document.body.appendChild(iframe);
};
