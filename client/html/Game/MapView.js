/* MissileApp map menu.
 * 
 * Must copy-paste markup into the app.
 */
function MapView(Imports) {
	FixedHeightView.call(this, Imports.domId["MapView"], Imports);
	$("#" + Imports.domId["MapView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
	// TODO Wire static button events
}

MapView.prototype = Object.create(FixedHeightView.prototype);

MapView.prototype.onView = function () {
	this.GameMasterTicket = this.Imports.GameMaster.subscribe(this._updateWithNewGames.bind(this));
	this.NBLocationTicket = this.Imports.NativeBridge.getLocationUpdates(true, this._updateWithNewLocation.bind(this));
	FixedHeightView.prototype.onView.call(this);
};

MapView.prototype.offView = function () {
	this.Imports.GameMaster.unsubscribe(this.GameMasterTicket);
	this.Imports.NativeBridge.getLocationUpdates(false, this.NBLocationTicket);
	FixedHeightView.prototype.offView.call(this);
};

MapView.prototype.show = function (game) {
	this._game = game;
	this._updateGame();
	this.Imports.ViewManager.loadView(this);
};

MapView.prototype._updateWithNewGames = function (games) {
	for (var i in games) {
		if (games[i].id === this._game.id) {
			this._game = games[i];
			this._updateGame();
		}
	}
};

MapView.prototype._updateGame = function () {
	$("#game").text(JSON.stringify(this._game));
};

MapView.prototype._updateWithNewLocation = function (location) {
	this._location = location;
	this._updateLocation();
};

MapView.prototype._updateLocation = function () {
	$("#gps").text(JSON.stringify(this._location));
};