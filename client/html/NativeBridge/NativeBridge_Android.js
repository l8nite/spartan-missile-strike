/* NativeBridge_Android
 * Android implementation of NativeBridge_Abstract.
 * Must implement all methods required by NativeBridge_Abstract!
 */

function NativeBridge_Android() {
	NativeBridge_Abstract.call(this);
}

NativeBridge_Android.prototype = Object.create(NativeBridge_Abstract.prototype);

NativeBridge_Android.prototype._getLocationUpdates = function (activate, callbackID) {
	AndroidInterface.getLocationUpdates(activate, callbackID);
};

NativeBridge_Android.prototype._getOrientationUpdates = function (activate, callbackID) {
	AndroidInterface.getOrientationUpdates(activate, callbackID);
};

NativeBridge_Android.prototype._getCurrentLocation = function (callbackID) {
	AndroidInterface.getCurrentLocation(callbackID);
};

NativeBridge_Android.prototype.showFireMissileScreen = function (activate) {
	AndroidInterface.showFireMissileScreen(activate);
};

NativeBridge_Android.prototype._getPreference = function (preferences, callbackID) {
	AndroidInterface.getPreference(preferences, callbackID);
};

NativeBridge_Android.prototype._setPreference = function (preferences, callbackID) {
	AndroidInterface.setPreference(preferences, callbackID);
};

NativeBridge_Android.prototype._getFacebookAccessToken = function (callbackID) {
	AndroidInterface.getFacebookAccessToken(callbackID);
};

NativeBridge_Android.prototype._onMainMenu = function (areWe) {
	AndroidInterface.onMainMenu(areWe);
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
