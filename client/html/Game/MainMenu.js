/* MissileApp main menu.
 * 
 * Must copy-paste the MainMenu.html markup into the app.
 * Call MainMenu with the DOM ID of that markup.
 */
function MainMenu(Imports) {
	this.Imports = Imports;
	var mainMenuView = View.call(this, this.Imports.domId["MainMenu"]);
	// TODO Wire static button events
}

MainMenu.prototype = View.prototype;

MainMenu.prototype.onView = function () {
	this.GameMasterTicket = this.Imports.GameMaster.subscribe(this._render.bind(this));
	View.prototype.onView.call(this);
};

MainMenu.prototype.offView = function () {
	this.Imports.GameMaster.unsubscribe(this.GameMasterTicket);
	View.prototype.offView.call(this);
};

MainMenu.prototype.show = function () {
	this.Imports.ViewManager.loadView(this);
};

MainMenu.prototype._render = function (games) {
	var that = this;
	var gamePrototype = $("#" + this.Imports.domId["MainMenu"] + " #game-prototype");
	for (var i in games) {
		var opponentid = games[i].creator;
		if (opponentid === this.Imports.GameMaster.userid) {
			opponentid = games[i].opponent;
		}
		var g = gamePrototype.clone();
		g.find(".opponent").replaceWith(this.Imports.GameMaster.getName(opponentid));
		g.click(function () {
			that._showGame(games[i]);
		});
		if (games[i].status === "completed") {
			$("#" + this.Imports.domId["MainMenu"] + " #list-complete").append(g);
		} else if (games[i].current === opponentid) {
			$("#" + this.Imports.domId["MainMenu"] + " #list-histurn").append(g);
		} else {
			$("#" + this.Imports.domId["MainMenu"] + " #list-yourturn").append(g);
		}
	}
};

MainMenu.prototype._showGame = function (game) {
	if (!this.mapView) {
		this.mapView = new MapView(this.Imports);
	}
	this.mapView.showGame(game);
};