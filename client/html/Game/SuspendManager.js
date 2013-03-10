function SuspendManager() {
	this._wakeListeners = new Fridge();
}

SuspendManager.prototype.addWakeListener = function (fn) {
	this._wakeListeners.add(fn);
};

SuspendManager.prototype.removeWakeListener = function (id) {
	this._wakeListeners.remove(id);
};

SuspendManager.prototype.wake = function () {
	var a = this._wakeListeners.getAll();
	for (var i in a) {
		a[i]();
	}
};