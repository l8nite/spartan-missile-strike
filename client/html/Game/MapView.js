/* MissileApp map menu.
 */
function MapView(Imports) {
	var that = this;
	this.Imports = Imports;
	FixedHeightView.call(this, Imports.domId["MapView"]);
	$("#" + Imports.domId["MapView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
	$("#" + Imports.domId["MapView"] + " .fireBtn").click(function () {
		if (!Imports.Views["FireView"]) {
			Imports.Views["FireView"] = new FireView(Imports);
		}
		Imports.Views["FireView"].show(that._game);
	});
	// TODO Wire static button events
}

MapView.prototype = Object.create(FixedHeightView.prototype);

MapView.prototype.onView = function () {
	this.GameMasterTicket = this.Imports.GameMaster.subscribeGames(this._updateWithNewGames.bind(this));
	this.NBLocationTicket = this.Imports.NativeBridge.startLocationUpdates(this._updateWithNewLocation.bind(this));
	FixedHeightView.prototype.onView.call(this);
};

MapView.prototype.offView = function () {
	this.Imports.GameMaster.unsubscribeGames(this.GameMasterTicket);
	this.Imports.NativeBridge.stopLocationUpdates(this.NBLocationTicket);
	FixedHeightView.prototype.offView.call(this);
};

MapView.prototype.show = function (game) {
	this._game = game;
	this._updateGame();
	this.Imports.ViewManager.loadView(this, this.Imports.Views["MainMenu"]);
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
	$("#" + this.Imports.domId["MapView"] + " .game").text(JSON.stringify(this._game));
	if (this._game.current === this.Imports.GameMaster.userid && this._game.status === "active") {
		$("#" + this.Imports.domId["MapView"] + " .fireBtn").removeClass("hidden");
	} else {
		$("#" + this.Imports.domId["MapView"] + " .fireBtn").addClass("hidden");
	}
};

MapView.prototype._updateWithNewLocation = function (loc) {
	this._location = loc;
	this._updateLocation();
};

MapView.prototype._updateLocation = function () {
	$("#" + this.Imports.domId["MapView"] + " .gps").text(JSON.stringify(this._location));
};
