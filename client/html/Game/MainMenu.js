/* MissileApp main menu.
 * 
 * Must copy-paste the MainMenu.html markup into the app.
 * Call MainMenu with the DOM ID of that markup.
 */
function MainMenu(Imports) {
	var that = this;
	this.Imports = Imports;
	FixedHeightView.call(this, Imports.domId["MainMenu"]);

	$("#" + Imports.domId["MainMenu"] + " .newGameBtn").click(function () {
		if (!Imports.Views["OpponentsView"]) {
			Imports.Views["OpponentsView"] = new OpponentsView(Imports);
		}
		Imports.Views["OpponentsView"].show();
	});
}

MainMenu.prototype = Object.create(View.prototype);

MainMenu.prototype.onView = function () {
	this.GameMasterTicket = this.Imports.GameMaster.subscribeGames(this._render.bind(this));
	View.prototype.onView.call(this);
};

MainMenu.prototype.offView = function () {
	this.Imports.GameMaster.unsubscribeGames(this.GameMasterTicket);
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
			var g = $("<div></div>");
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
			that.Imports.GameMaster.getName(opponentid).always(function (name) {
				var nameToUse = opponentid;
				if (name) {
					nameToUse = name;
				}
				g.text(nameToUse);
			});
		})(games[i]);
	}
};

MainMenu.prototype._showGame = function (game) {
	if (!game[this.Imports.GameMaster.userid].base) {
		if (!this.Imports.Views["BaseView"]) {
			this.Imports.Views["BaseView"] = new BaseView(this.Imports);
		}
		this.Imports.Views["BaseView"].show(game);
	} else {
		if (!this.Imports.Views["MapView"]) {
			this.Imports.Views["MapView"] = new MapView(this.Imports);
		}
		this.Imports.Views["MapView"].show(game);
	}
};
