/* Centralized handling and retrieval of games data structure.
 * Has interface where other game components can ask for the current games
 * datastructure, or can un/subscribe from updates via callback registration.
 */

function TheGM(userid, sessionid) {
	this._userid = userid;
	this._sessionid = sessionid;
	this._listeners = {
		listeners: [],
		holes: []
	};
	this._games = {
		when: null,
		games: []
	};
}

TheGM.prototype.getGames = function () {
	var that = this;
	return this._getGamesFromService().done(function (response) {
		that._games.games = response;
		that._games.when = new Date();
		that._notifyListeners();
		return response;
	});
}

TheGM.prototype.subscribe = function (when) {
	when(this._games.games);
	var i = this._listeners.holes.pop();
	if (i || i === 0) {
		this._listeners.listeners[i] = when;
	}
	else {
		i = this._listeners.listeners.push(when) - 1;
	}
	this._startPollingService();
	return i;
}

TheGM.prototype.unsubscribe = function (callbackid) {
	if (this._listeners.listeners[callbackid]) {
		this._listeners.holes.push(callbackid);
		delete this._listeners.listeners[callbackid];
		if (this._listeners.holes.length === this._listeners.listeners.length) {
			this._stopPollingService();
		}
	}
}

TheGM.prototype._getGamesFromService = function () {
	return $.ajax({
		url: Imports.serviceurl + "/users/" + this._userid + "/games",
		headers: {
			"SMSS-Session-ID": this._sessionid
		},
		dataType: "json"
	});
}

TheGM.prototype._startPollingService = function () {
	if (!this._poll) {
		var that = this;
		this._poll = setInterval(function () {
			that.getGames();
		}, this._STALE);
		this.getGames();
	}
}

TheGM.prototype._stopPollingService = function () {
	if (this._poll) {
		clearInterval(this._poll);
		delete this._poll;
	}
}

TheGM.prototype._notifyListeners = function () {
	for (var i in this._listeners.listeners) {
		this._listeners.listeners[i](this._games.games);
	}
}

TheGM.prototype._isStale = function () {
	return (new Date().getTime() - this._games.when.getTime() >= this._STALE);
}

// How long before games datastructure becomes stale
TheGM.prototype._STALE = 60000;