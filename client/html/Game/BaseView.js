/* MissileApp base view.
 */
function BaseView(Imports) {
	var that = this;
	this.Imports = Imports;
	// Default value for debug
	this._location = {
		latitude: 0,
		longitude: 0
	};
	View.call(this, Imports.domId["BaseView"]);

	$("#" + that.Imports.domId["BaseView"])
	.css("background-image", "url(\"../shared/Image Assets/spartanStrike_BG.jpg\")")
	.css("background-size", "100%");

	$("#" + Imports.domId["BaseView"] + " .startBtn").click(function () {
		if (typeof that._game === "string") {
			// _game is a userid
			Imports.GameMaster.newGame(that._game, that._location).done(function (game) {
				if (!Imports.Views["MapView"]) {
					Imports.Views["MapView"] = new MapView(Imports);
				}
				Imports.Views["MapView"].show(game);
			});
		} else {
			// _game is a game
			Imports.GameMaster.acceptInvitation(that._game.id, that._location).done(function (game) {
				if (!Imports.Views["MapView"]) {
					Imports.Views["MapView"] = new MapView(Imports);
				}
				Imports.Views["MapView"].show(game);
			});
		}
	});

	$("#" + Imports.domId["BaseView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
}

BaseView.prototype = Object.create(View.prototype);

BaseView.prototype.onView = function () {
	this.NBLocationTicket = this.Imports.NativeBridge.startLocationUpdates(this._updateWithNewLocation.bind(this));
	View.prototype.onView.call(this);
};

BaseView.prototype.offView = function () {
	this.Imports.NativeBridge.stopLocationUpdates(this.NBLocationTicket);
	View.prototype.offView.call(this);
};

BaseView.prototype.show = function (game) {
	this._game = game;
	this.Imports.ViewManager.loadView(this);
};

BaseView.prototype._updateWithNewLocation = function (loc) {
	this._location = loc;

	$("#" + this.Imports.domId["BaseView"] + " .gps").text(JSON.stringify(loc));
};
