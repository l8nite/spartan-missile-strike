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

TheGM.prototype.getGames = function (when) {
	if (this._games.when === null || this._isStale()) {
		$.ajax({
			url: Imports.serviceurl + "/users/" + this._userid + "/games",
			headers: {
				"SMSS-Session-ID": this._sessionid
			},
			dataType: "json"
		}).done(function (response) {
			this._games.games = response;
			this._games.when = new Date();
			when(this._games.games);
			this._notifyListeners();
		}).fail(function () {
			Imports.log("Failed to get games from webservice; using stale games");
			when(this._games.games);
		});
	}
	else {
		when(this._games.games);
	}
}

TheGM.prototype.subscribe = function (when) {
	var i;
	if (i = this._listeners.holes.pop()) {
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

TheGM.prototype._startPollingService = function () {
	if (!this._poll) {
		var that = this;
		(function poll() {
			$.ajax({
				url: Imports.serviceurl + "/users/" + that._userid + "/games",
				headers: {
					"SMSS-Session-ID": that._sessionid
				},
				dataType: "json"
			}).done(function (response) {
				that._games.games = response;
				that._games.when = new Date();
				that._notifyListeners();
				that._poll = setTimeout(poll, that._STALE);
			}).fail(function () {
				that._poll = setTimeout(poll, that._STALE);
			});
		})();
	}
}

TheGM.prototype._stopPollingService = function () {
	if (this._poll) {
		clearTimeout(this._poll);
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