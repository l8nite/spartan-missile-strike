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
	this._games = {
		when: null,
		games: []
	};
	this.nameCache = [];
}

/* Returns a $.Deferred which will be resolved with a fresh games data structure.
 * The deferred will reject if a problem was encountered getting fresh games.
 * If no problems were encountered, getGames records the fresh games data structure and when it was received
 * (used to determine when fresh games go stale and need to be fetched again), then calls listeners with the
 * fresh games array.
 */
GameMaster.prototype.getGames = function () {
	var that = this;
	var d = new $.Deferred();
	this._getGamesFromService().done(function (response) {
		that._games.games = response;
		that._games.when = new Date();
		var weHaventMet = [];
		for (var i in response) {
			if (!that.nameCache[response[i].creator]) {
				weHaventMet.push(response[i].creator);
			}
			if (!that.nameCache[response[i].opponent]) {
				weHaventMet.push(response[i].opponent);
			}
		}
		if (weHaventMet.length === 0) {
			d.resolve(response);
		} else {
			that._getNamesFromService(weHaventMet).done(function (names) {
				for (var i in names) {
					that.nameCache[i] = names[i];
				}
			}).always(function () {
				d.resolve(response);
			});
		}
	});
	d.done(function () {
		that._notifyListeners();
	});
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
GameMaster.prototype._getGamesFromService = function () {
	return $.ajax({
		url: Imports.serviceurl + "/users/" + this.userid + "/games",
		headers: {
			"MissileAppSessionId": this._sessionid
		},
		dataType: "json"
	});
};

/* Find out the common names of obscure user ids.
 * Returns a deferred to be resolved with array of names.
 * Takes a contiguous array.
 */
GameMaster.prototype._getNamesFromService = function (userids) {
	var d = new $.Deferred();
	var names = [];
	var responses = 0;
	function checkAndResolve() {
		if (++responses === userids.length) {
			d.resolve(names);
		}
	}
	for (var j in userids) {
		$.ajax({
			url: Imports.serviceurl + "/users/" + userids[j],
			headers: {
				"MissileAppSessionId": this._sessionid
			},
			dataType: "json"
		}).done(function (response) {
			names[response.id] = {
				username: response.username
			};
			$.ajax({
				url: "http://graph.facebook.com/" + response.facebook_id,
				dataType: "json"
			}).done(function (fbResponse) {
				names[response.id].realname = fbResponse.name;
			}).always(function () {
				checkAndResolve();
			});
		}).fail(function () {
			checkAndResolve();
		});
	}
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

/* Check if games array is stale
 */
GameMaster.prototype._isStale = function () {
	return (new Date().getTime() - this._games.when.getTime() >= this._STALE);
};

// How long before games datastructure becomes stale
GameMaster.prototype._STALE = 60000;