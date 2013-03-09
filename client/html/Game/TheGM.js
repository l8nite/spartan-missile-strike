/* TheGM
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

/* Returns a $.Deferred which will be resolved with a fresh games data structure.
 * The deferred will reject if a problem was encountered getting fresh games.
 * If no problems were encountered, getGames records the fresh games data structure and when it was received
 * (used to determine when fresh games go stale and need to be fetched again), then calls listeners with the
 * fresh games array.
 */
TheGM.prototype.getGames = function () {
	var that = this;
	return this._getGamesFromService().done(function (response) {
		that._games.games = response;
		that._games.when = new Date();
		that._notifyListeners();
		return response;
	});
}

/* Subscribe a listener function.
 * Returns a callback ID with which you can unsubscribe the specified listener.
 * On subscribe, listener is immediately called with current games array.
 * If TheGM is currently not polling the webservice, it starts polling.
 */
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

/* Unsubscribe a listener function.
 */
TheGM.prototype.unsubscribe = function (callbackid) {
	if (this._listeners.listeners[callbackid]) {
		this._listeners.holes.push(callbackid);
		delete this._listeners.listeners[callbackid];
		if (this._listeners.holes.length === this._listeners.listeners.length) {
			this._stopPollingService();
		}
	}
}

/* Call to the webservice.
 * Returns a deferred to be resolved with the games array
 */
TheGM.prototype._getGamesFromService = function () {
	return $.ajax({
		url: Imports.serviceurl + "/users/" + this._userid + "/games",
		headers: {
			"SMSS-Session-ID": this._sessionid
		},
		dataType: "json"
	});
}

/* If not already polling, start polling!
 */
TheGM.prototype._startPollingService = function () {
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
}

/* Stop polling
 */
TheGM.prototype._stopPollingService = function () {
	if (this._poll) {
		clearTimeout(this._poll);
		delete this._poll;
	}
}

/* Call all listeners with current games array
 */
TheGM.prototype._notifyListeners = function () {
	for (var i in this._listeners.listeners) {
		this._listeners.listeners[i](this._games.games);
	}
}

/* Check if games array is stale
 */
TheGM.prototype._isStale = function () {
	return (new Date().getTime() - this._games.when.getTime() >= this._STALE);
}

// How long before games datastructure becomes stale
TheGM.prototype._STALE = 60000;