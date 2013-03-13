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
function GameMaster(userid, sessionid) {
	this.userid = userid;
	this._sessionid = sessionid;
	this._listeners = new Fridge();
	this._cachedNames = [];
	this._games = {
		when: null,
		games: []
	};
}

/* Returns a $.Deferred which will be resolved with a fresh games data structure.
 * The deferred will reject if a problem was encountered getting fresh games.
 * If no problems were encountered, getGames records the fresh games data structure and when it was received
 * (used to determine when fresh games go stale and need to be fetched again), then calls listeners with the
 * fresh games array.
 */
GameMaster.prototype.getGames = function () {
	var that = this;
	var updated;
	if (this._games.games[0]) {
		updated = this._games.games[0].updated;
	}
	return this._getGamesFromService(updated).done(function (response) {
		var newGames = response;
		for (var i in that._games.games) {
			var outofdate = false;
			for (var j in newGames) {
				if (that._games.games[i].id === newGames[j].id) {
					outofdate = true;
					break;
				}
			}
			if (!outofdate) {
				newGames.push(that._games.games[i].id);
			}
		}
		that._games.games = newGames;
		that._games.when = new Date();
		that._notifyListeners();
	});
};

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

/* Subscribe a listener function.
 * Returns a callback ID with which you can unsubscribe the specified listener.
 * On subscribe, listener is immediately called with current games array.
 * If GameMaster is currently not polling the webservice, it starts polling.
 */
GameMaster.prototype.subscribe = function (when) {
	when(this._games.games);
	this._startPollingService();
	return this._listeners.add(when);
};

/* Unsubscribe a listener function.
 */
GameMaster.prototype.unsubscribe = function (callbackid) {
	this._listeners.remove(callbackid);
	if (this._listeners.count() === 0) {
		this._stopPollingService();
	}
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
	return $.ajax({
		url: Imports.serviceurl + "/users/" + this.userid + "/games",
		headers: headers,
		dataType: "json"
	});
};

/* Find out the common names of obscure user ids.
 * Returns a deferred to be resolved with array of names.
 * Takes a contiguous array.
 */
GameMaster.prototype._getNameFromService = function (userid) {
	var d = new $.Deferred();
	$.ajax({
		url: Imports.serviceurl + "/users/" + userid,
		headers: {
			"MissileAppSessionId": this._sessionid
		},
		dataType: "json"
	}).done(function (MAResponse) {
		name = {
			username: MAResponse.username
		};
		$.ajax({
			url: "http://graph.facebook.com/" + response.facebook_id,
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

/* If not already polling, start polling!
 */
GameMaster.prototype._startPollingService = function () {
	if (!this._poll) {
		var that = this;
		function poll() {
			that.getGames().always(function () {
				if (that._poll) {
					that._poll = setTimeout(poll, that._STALE);
				}
			});
		};
		this._poll = setTimeout(poll, this._games.when ? this._games.when.getTime() + this._STALE - new Date().getTime() : 0);
	}
};

/* Stop polling
 */
GameMaster.prototype._stopPollingService = function () {
	if (this._poll) {
		clearTimeout(this._poll);
		delete this._poll;
	}
};

/* Call all listeners with current games array
 */
GameMaster.prototype._notifyListeners = function () {
	var a = this._listeners.getAll();
	for (var i in a) {
		a[i](this._games.games);
	}
};

// How long before games datastructure becomes stale
GameMaster.prototype._STALE = 60000;