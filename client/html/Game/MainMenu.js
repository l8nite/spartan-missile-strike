/* MissileApp main menu.
 */
function MainMenu(Imports) {
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["MainMenu"]);

	$("#" + Imports.domId["MainMenu"] + " .newGameBtn").click(function () {
		if (!Imports.Views["OpponentsView"]) {
			Imports.Views["OpponentsView"] = new OpponentsView(Imports);
		}
		Imports.Views["OpponentsView"].show();
	});

	$("#" + Imports.domId["MainMenu"] + " .optionsBtn").click(function () {
		if (!Imports.Views["OptionsView"]) {
			Imports.Views["OptionsView"] = new OptionsView(Imports);
		}
		Imports.Views["OptionsView"].show();
	});

	$("#" + Imports.domId["MainMenu"] + " .scrollable").css("background-image", "url(\"../shared/Image Assets/spartanStrike_BG.jpg\")")
	.css("background-size", "100%")
	.css("min-height", window.innerHeight);
	$("#" + Imports.domId["MainMenu"] + " .buttons").css("height", window.innerWidth * .2)
	.css("padding-top", window.innerWidth * .02)
	.css("padding-bottom", window.innerWidth * .02)
	.css("text-align", "center");
	$("#" + Imports.domId["MainMenu"] + " .newGameBtn").css("height", "100%");
	$("#" + Imports.domId["MainMenu"] + " .optionsBtn").css("height", "100%");
	$("#" + Imports.domId["MainMenu"] + " .menu-bomb").css("height", "100%");
	$("#" + Imports.domId["MainMenu"] + " .games-list").css("width", window.innerWidth * .9)
	.css("margin-left", "auto")
	.css("margin-right", "auto");
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
			var gameDiv = $("<div></div>");
			gameDiv.addClass("game");
			gameDiv.click(function () {
				that._showGame(game);
			});
			if (game.status === "completed") {
				$("#list-complete").append(gameDiv);
			} else if (game.current === opponentid) {
				$("#list-his-turn").append(gameDiv);
			} else {
				$("#list-your-turn").append(gameDiv);
			}
			that.Imports.GameMaster.getName(opponentid).always(function (name) {
				var nameToUse = opponentid;
				if (name) {
					nameToUse = name;
				}
				gameDiv.text(nameToUse);
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
