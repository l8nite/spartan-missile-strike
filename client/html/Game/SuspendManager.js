function SuspendManager() {
	this._hooks = {
		hooks: [],
		holes: []
	};
}

SuspendManager.prototype.addHook = function (hookFn) {
	var i = this._hooks.holes.pop();
	if (i || i === 0) {
		this._hooks.hooks[i] = hookFn;
	}
	else {
		i = this._hooks.hooks.push(hookFn) - 1;
	}
	return i;
};

SuspendManager.prototype.removeHook = function (hookId) {
	if (this._hooks.hooks[hookId]) {
		this._hooks.holes.push(hookId);
		delete this._hooks.hooks[hookId];
	}
};

SuspendManager.prototype.wake = function () {
	for (var i in this._hooks.hooks) {
		this._hooks.hooks[i]();
	}
};