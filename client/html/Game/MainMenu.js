/* MissileApp main menu.
 * 
 * Must copy-paste the MainMenu.html markup into the app.
 * Call MainMenu with the DOM ID of that markup.
 */
function MainMenu(Imports) {
	this.Imports = Imports;
	View.call(this, Imports.domId["MainMenu"]);
	// TODO Wire static button events
}

MainMenu.prototype = Object.create(View.prototype);

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
	// For now, we cheat!
	games = this.Imports.GameMaster._games.games;
	var that = this;
	$("#main-menu .game").remove();
	for (var i in games) {
		(function (game) {
			var opponentid = game.creator;
			if (opponentid === that.Imports.GameMaster.userid) {
				opponentid = game.opponent;
			}
			that.Imports.GameMaster.getName(opponentid).always(function (name) {
				var nameToUse = opponentid;
				if (name) {
					if (name.realname) {
						nameToUse = name.realname;
					} else {
						nameToUse = name.username;
					}
				}
				var g = $("<div>" + nameToUse + "</div>");
				g.addClass("game");
				g.click(function () {
					that._showGame(game);
				});
				if (game.status === "completed") {
					$("#list-complete").append(g);
				} else if (game.current === opponentid) {
					$("#list-histurn").append(g);
				} else {
					$("#list-yourturn").append(g);
				}
			});
		})(games[i]);
	}
};

MainMenu.prototype._showGame = function (game) {
	if (!this._mapView) {
		this._mapView = new MapView(this.Imports);
	}
	this._mapView.show(game);
};