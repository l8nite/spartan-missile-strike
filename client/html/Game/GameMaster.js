/* GameMaster
 * 
 * Centralized handling and retrieval of games data structure.
 * Has interface where other game components can ask for the current games
 * datastructure, or can un/subscribe from updates via callback registration.
 * 
 * Polls webservice for new games datastructure when the local copy goes "stale".
 */

/* Constructor.
 *
 * userid: User ID as per webservice
 * sessionid: Session ID as per webservice
 */
function GameMaster(userid, sessionid, Imports) {
	this.Imports = Imports;
	this.userid = userid;
	this._sessionid = sessionid;
	this._gamesListeners = new Fridge();
	this._locationListeners = new Fridge();
	this._cachedNames = [];
	this._location = {};
	this._games = {
		when: null,
		games: []
	};
}

/* Returns a $.Deferred which will be resolved with a the name belonging to the requested userid.
 * For speed, a names are cached to later retrieval!
 */
GameMaster.prototype.getName = function (userid) {
	var that = this;
	var d = new $.Deferred();
	if (this._cachedNames[userid]) {
		d.resolve(this._cachedNames[userid]);
	} else {
		this._getNameFromService(userid).done(function (name) {
			that._cachedNames[userid] = name;
			d.resolve(name);
		}).fail(function () {
			d.reject();
		});
	}
	return d;
};

/* Subscribe a listener function to game updates.
 * Returns a callback ID with which you can unsubscribe the specified listener.
 * On subscribe, listener is immediately called with current games array.
 * If GameMaster is currently not polling the webservice, it starts polling.
 */
GameMaster.prototype.subscribeGames = function (when) {
	var that = this;
	setTimeout(function () {
		when(that._games.games);
	}, 0);
	this._startPollingService();
	return this._gamesListeners.add(when);
};

/* Unsubscribe a listener listening for games.
 */
GameMaster.prototype.unsubscribeGames = function (ticket) {
	this._gamesListeners.remove(ticket);
	if (this._gamesListeners.count() === 0) {
		this._stopPollingService();
	}
};

/* Subscribe a listener function to location updates.
 * Returns a callback ID (ticket) which is used to unsubscribe the listener at
 * a later time.
 * On subscribe, the listener is immediately called with the location data stored
 * in memory. If this is the first listener, the NB is called to receive location updates.
 */
GameMaster.prototype.subscribeLocation = function (when) {
	var that = this;
	setTimeout(function () {
		when(that._location);
	}, 0);
	if (!this._locationUpdatesTicket) {
		this._locationUpdatesTicket = this.Imports.NativeBridge.startLocationUpdates(function (loc) {
			that._location = loc;
			that._notifyLocationListeners();
		});
	}
};

/* Unsubscribe a location listener with the specified ticket.
 * If no more listeners are present, stop location updates.
 */
GameMaster.prototype.unsubscribeLocation = function (ticket) {
	this._locationListeners.remove(ticket);
	if (this._locationListeners.count() === 0) {
		this.Imports.NativeBridge.stopLocationUpdates(this._locationUpdatesTicket);
	}
};

/* Fire a missile with a specified location, orientation, and power.
 * The call to the service returns the updated game post-shot; this method takes that update
 * and updates the locally maintained games list, notifying listeners of changes.
 * Returns a $.Deferred resolved with the updated game.
 */
GameMaster.prototype.doFire = function (game, loc, orientation, power) {
	var that = this;
	var gameid = game;
	if (typeof gameid === "object") {
		gameid = gameid.id;
	}
	return this._doFireOnService(gameid, loc, orientation, power).done(function (response) {
		that._mixGames(response);
		that._notifyGamesListeners(response);
	});
};

/* Returns a $.Deferred which will be resolved with a fresh games data structure.
 * The deferred will reject if a problem was encountered getting fresh games.
 * If no problems were encountered, _getGames records the fresh games data structure and when it was received
 * (used to determine when fresh games go stale and need to be fetched again), then calls listeners with the
 * fresh games array.
 */
GameMaster.prototype._getGames = function () {
	var that = this;
	var updated;
	if (this._games.games[0]) {
		updated = this._games.games[0].updated;
	}
	return this._getGamesFromService(updated).done(function (response) {
		if (response && response.length > 0) {
			that._mixGames(response);
			that._notifyGamesListeners(response);
		}
		that._games.when = new Date();
	});
};

/* Returns a $.Deferred resolved with the webservice's response to the shot
 */
GameMaster.prototype._doFireOnService = function (gameid, loc, orientation, power) {
	var shot = {
		latitude: loc.latitude,
		longitude: loc.longitude,
		angle: orientation.altitude * 180 / Math.PI,
		heading: orientation.azimuth * 180 / Math.PI,
		power: power
	};
	return $.ajax(this.Imports.serviceurl + "/games/" + encodeURIComponent(gameid) + "/fire-missile", {
		type: "PUT",
		contentType: "application/json",
		headers: {
			"MissileAppSessionId": this._sessionid
		},
		dataType: "json",
		data: JSON.stringify(shot)
	}).pipe(function (response) {
		response.created = new Date(response.created);
		response.updated = new Date(response.updated);
		return response;
	});
};

/* Call to the webservice.
 * Returns a deferred to be resolved with the games array
 */
GameMaster.prototype._getGamesFromService = function (fromWhen) {
	var headers = {
		"MissileAppSessionId": this._sessionid
	};
	if (fromWhen) {
		headers["If-Modified-Since"] = fromWhen.toGMTString();
	}
	return $.ajax(this.Imports.serviceurl + "/users/" + encodeURIComponent(this.userid) + "/games", {
		headers: headers,
		dataType: "json"
	}).pipe(function (response) {
		var games = response.games;
		games.forEach(function (e, i, a) {
			e.created = new Date(e.created);
			e.updated = new Date(e.updated);
		});
		return games;
	});
};

/* Find out the common names of obscure user ids.
 * Returns a deferred to be resolved with array of names.
 * Takes a contiguous array.
 */
GameMaster.prototype._getNameFromService = function (userid) {
	var d = new $.Deferred();
	$.ajax(this.Imports.serviceurl + "/users/" + encodeURIComponent(userid), {
		headers: {
			"MissileAppSessionId": this._sessionid
		},
		dataType: "json"
	}).done(function (MAResponse) {
		name = {
			username: MAResponse.username
		};
		$.ajax("http://graph.facebook.com/" + encodeURIComponent(response.facebook_id), {
			dataType: "json"
		}).done(function (fbResponse) {
			name.realname = fbResponse.name;
		}).always(function () {
			d.resolve(name);
		});
	}).fail(function () {
		d.reject();
	});
	return d;
};

/* If not already polling for games, start polling!
 */
GameMaster.prototype._startPollingService = function () {
	if (!this._poll) {
		var that = this;
		function poll() {
			that._getGames().always(function () {
				if (that._poll) {
					that._poll = setTimeout(poll, that._STALE);
				}
			});
		};
		this._poll = setTimeout(poll, this._games.when ? this._games.when.getTime() + this._STALE - new Date().getTime() : 0);
	}
};

/* Stop polling for games
 */
GameMaster.prototype._stopPollingService = function () {
	if (this._poll) {
		clearTimeout(this._poll);
		delete this._poll;
	}
};

/* Call all games listeners with current games array
 */
GameMaster.prototype._notifyGamesListeners = function (games) {
	var a = this._gamesListeners.getAll();
	for (var i in a) {
		a[i](games);
	}
};

/* Call all location listeners with updated location
 */
GameMaster.prototype._notifyLocationListeners = function (loc) {
	var a = this._locationListeners.getAll();
	for (var i in a) {
		a[i](loc);
	}
};

/* Takes an array of games and mixes the replaces outdated games currently in the games array
 */
GameMaster.prototype._mixGames = function (games) {
	var newGames = [];
	for (var i in games) {
		newGames.push(games[i]);
	}
	for (var i in this._games.games) {
		var outofdate = false;
		for (var j in games) {
			if (this._games.games[i].id === games[j].id) {
				outofdate = true;
				break;
			}
		}
		if (!outofdate) {
			newGames.push(this._games.games[i]);
		}
	}
	this._games.games = newGames;
};

// How long before games datastructure becomes stale
GameMaster.prototype._STALE = 10000;
