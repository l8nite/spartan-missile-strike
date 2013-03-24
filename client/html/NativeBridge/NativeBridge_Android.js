/* NativeBridge_Android
 * Android implementation of NativeBridge_Abstract.
 * Must implement all methods required by NativeBridge_Abstract!
 */

function NativeBridge_Android() {
	NativeBridge_Abstract.call(this);
}

NativeBridge_Android.prototype = Object.create(NativeBridge_Abstract.prototype);

NativeBridge_Android.prototype._startLocationUpdates = function (callbackID) {
	AndroidInterface.startLocationUpdates(callbackID);
};

NativeBridge_Android.prototype._stopLocationUpdates = function () {
	AndroidInterface.stopLocationUpdates();
};

NativeBridge_Android.prototype._startOrientationUpdates = function (callbackID) {
	AndroidInterface.startOrientationUpdates(callbackID);
};

NativeBridge_Android.prototype._stopOrientationUpdates = function () {
	AndroidInterface.stopOrientationUpdates();
};

NativeBridge_Android.prototype.showFireMissileScreen = function () {
	AndroidInterface.showFireMissileScreen();
};

NativeBridge_Android.prototype.hideFireMissileScreen = function () {
	AndroidInterface.hideFireMissileScreen();
};

NativeBridge_Android.prototype._getPreferences = function (preferences, callbackID) {
	AndroidInterface.getPreferences(preferences, callbackID);
};

NativeBridge_Android.prototype._setPreferences = function (preferences, callbackID) {
	AndroidInterface.setPreferences(preferences, callbackID);
};

NativeBridge_Android.prototype._getFacebookAccessToken = function (callbackID) {
	AndroidInterface.getFacebookAccessToken(callbackID);
};

NativeBridge_Android.prototype.logoutFacebook = function () {
	AndroidInterface.logoutFacebook();
};

NativeBridge_Android.prototype.playSound = function (soundID, options) {
	AndroidInterface.playSound(soundID, options);
};

NativeBridge_Android.prototype.stopSound = function (soundID) {
	AndroidInterface.stopSound(soundID);
};

NativeBridge_Android.prototype.hideSplash = function () {
	AndroidInterface.hideSplash();
};

NativeBridge_Android.prototype.vibrate = function (time) {
	AndroidInterface.vibrate(time);
};

NativeBridge_Android.prototype.log = function (msg) {
	AndroidInterface.log(msg);
};
