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
	var gamePrototype = $("#" + this.Imports.domId["MainMenu"] + " #game-prototype");
	for (var i in games) {
		var g = gamePrototype.clone();
		g.find(".opponent").replaceWith
	}
};

MainMenu.prototype._showGame = function (game) {
	if (!this.mapView) {
		this.mapView = new MapView(this.Imports);
	}
	this.mapView.showGame(game);
};