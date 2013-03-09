function SuspendManager() {
	this._wakeListeners = new FunctionFridge();
}

SuspendManager.prototype.addWakeListener = function (fn) {
	this._wakeListeners.addFunction(fn);
};

SuspendManager.prototype.removeWakeListener = function (id) {
	this._wakeListeners.removeFunction(id);
};

SuspendManager.prototype.wake = function () {
	var a = this._wakeListeners.getFunctions();
	for (var i in a) {
		a[i]();
	}
};