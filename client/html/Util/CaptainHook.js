function CaptainHook() {
	this._hooks = [];
	this._holes = [];
}

CaptainHook.prototype.addHook = function (hookFn) {
	var i = this._holes.pop();
	if (i || i === 0) {
		this._hooks[i] = hookFn;
	} else {
		i = this._hooks.push(hookFn) - 1;
	}
	return i;
};

CaptainHook.prototype.removeHook = function (hookId) {
	if (this._hooks[hookId]) {
		this._holes.push(hookId);
		delete this._hooks[hookId];
	}
};

CaptainHook.prototype.countHooks = function () {
	return this._hooks.length - this._holes.length;
}