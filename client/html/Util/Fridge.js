function Fridge() {
	this._store = [];
	this._holes = [];
}

Fridge.prototype.add = function (fn) {
	var i = this._holes.pop();
	if (i || i === 0) {
		this._store[i] = fn;
	} else {
		i = this._store.push(fn) - 1;
	}
	return i;
};

Fridge.prototype.remove = function (id) {
	if (this._store[id]) {
		this._holes.push(id);
		delete this._store[id];
	}
};

Fridge.prototype.count = function () {
	return this._store.length - this._holes.length;
};

Fridge.prototype.getAll = function () {
	var a = [];
	for (var i in this._store) {
		a.push(this._store[i]);
	}
	return a;
};

Fridge.prototype.get = function (id) {
	return this._store[id];
}

