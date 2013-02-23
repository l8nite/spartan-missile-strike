/* NativeBridge_Android
 * Android implementation of NativeBridge_Abstract.
 * Must implement all methods required by NativeBridge_Abstract!
 */

function NativeBridge_Android() {
	NativeBridge_Abstract.call(this);
}
NativeBridge_Android.prototype = new NativeBridge_Abstract();
NativeBridge_Android.prototype.constructor = NativeBridge_Android;

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

NativeBridge_Android.prototype._getPreference = function (preference, callbackID) {
	AndroidInterface.getPreference(preference, callbackID);
};

NativeBridge_Android.prototype._setPreference = function (preference, callbackID) {
	var keyvalue = new Object();
	for (var i in preference) {
		keyvalue.key = i;
		keyvalue.value = preference[i];
	}
	AndroidInterface.setPreference(JSON.stringify(keyvalue), callbackID);
};

NativeBridge_Android.prototype._getFacebookAccessToken = function (callbackID) {
	AndroidInterface.getFacebookAccessToken(callbackID);
};

NativeBridge_Android.prototype.logoutFacebook = function () {
	AndroidInterface.logoutFacebook();
};

NativeBridge_Android.prototype.playSound = function (options) {
	AndroidInterface.playSound(JSON.parse(options));
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