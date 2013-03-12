/* NativeBridge_iOS
 * iOS implementation of NativeBridge_Abstract.
 * Must implement all methods required by NativeBride_Abstract!
 */

function NativeBridge_iOS() {
	NativeBridge_Abstract.call(this);
}
NativeBridge_iOS.prototype = new NativeBridge_Abstract();
NativeBridge_iOS.prototype.constructor = NativeBridge_iOS;

NativeBridge_iOS.prototype._getLocationUpdates = function (activate, callbackID) {
	this._appendIframe("spartan-missile-strike://getLocationUpdates/?arguments="
		+ JSON.stringify({
			activate : activate,
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype._getOrientationUpdates = function (activate, callbackID) {
	this._appendIframe("spartan-missile-strike://getOrientationUpdates/?arguments="
		+ JSON.stringify({
			activate : activate,
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype._getCurrentLocation = function (callbackID) {
	this._appendIframe("spartan-missile-strike://getCurrentLocation/?arguments="
		+ JSON.stringify({
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype.showFireMissileScreen = function (activate) {
	this._appendIframe("spartan-missile-strike://showFireMissileScreen/?arguments="
		+ JSON.stringify({
			activate : activate
		})
	);
};

NativeBridge_iOS.prototype._getPreference = function (preferences, callbackID) {
	this._appendIframe("spartan-missile-strike://getPreference/?arguments="
		+ JSON.stringify({
			preferences : preferences,
			identifier : callbackID
		})
	);
};

NativeBridge_iOS.prototype._setPreference = function (preferences, callbackID) {
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

NativeBridge_iOS.prototype.playSound = function (soundID, options) {
	this._appendIframe("spartan-missile-strike://playSound/?arguments="
		+ JSON.stringify({
			soundID: soundID,
			options: options
		})
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