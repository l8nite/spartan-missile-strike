function FunctionFridge() {
	this._functions = [];
	this._holes = [];
}

FunctionFridge.prototype.addFunction = function (fn) {
	var i = this._holes.pop();
	if (i || i === 0) {
		this._functions[i] = fn;
	} else {
		i = this._functions.push(fn) - 1;
	}
	return i;
};

FunctionFridge.prototype.removeFunction = function (id) {
	if (this._functions[id]) {
		this._holes.push(id);
		delete this._functions[id];
	}
};

FunctionFridge.prototype.countFunctions = function () {
	return this._functions.length - this._holes.length;
};

FunctionFridge.prototype.getFunctions = function () {
	var a = [];
	for (var i in this._functions) {
		a.push(this._functions[i]);
	}
	return a;
};

