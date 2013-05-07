/* MissileApp main menu.
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

	$("#" + Imports.domId["MainMenu"] + " .optionsBtn").click(function () {
		if (!Imports.Views["OptionsView"]) {
			Imports.Views["OptionsView"] = new OptionsView(Imports);
		}
		Imports.Views["OptionsView"].show();
	});

	$("#" + Imports.domId["MainMenu"] + " .bg").css("background-image", "url(\"../assets/shared/images/longBG_smaller.jpg\")")
	.css("background-size", "100%")
	.css("min-height", window.innerHeight - window.innerWidth * .17)
	.css("padding-left", window.innerWidth * .05)
	.css("padding-right", window.innerWidth * .05);

	$("#" + Imports.domId["MainMenu"] + " .scrollable")
	.css("height", window.innerHeight - window.innerWidth * .17)
	.css("overflow", "scroll");

	$("#" + Imports.domId["MainMenu"] + " .buttons").css("background-image", "url(\"../assets/shared/images/spartanStrike_header.jpg\")")
	.css("background-size", "100% 100%").css("height", window.innerWidth * .17)
	.css("text-align", "center")
	.append($("<img>").attr("src", "../assets/shared/images/spartanStrike_newGameIcon.png")
		.css("height", window.innerWidth * .13)
		.css("position", "absolute")
		.css("top", window.innerWidth * .01)
		.css("left", window.innerWidth * .01)
		.click(function () {
			if (!Imports.Views["OpponentsView"]) {
				Imports.Views["OpponentsView"] = new OpponentsView(Imports);
			}
			Imports.Views["OpponentsView"].show();
		})
	)
	.append($("<img>").attr("src", "../assets/shared/images/spartanStrike_optionsIcon.png")
		.css("height", window.innerWidth * .13)
		.css("position", "absolute")
		.css("top", window.innerWidth * .01)
		.css("left", window.innerWidth - window.innerWidth * .13 - window.innerWidth * .01)
		.click(function () {
			if (!Imports.Views["OptionsView"]) {
				Imports.Views["OptionsView"] = new OptionsView(Imports);
			}
			Imports.Views["OptionsView"].show();
		})
	)
	.append($("<img>").attr("src", "../assets/shared/images/spartanStrike_yourGames.png")
		.css("height", window.innerWidth * .13)
		.css("position", "absolute")
		.css("top", window.innerWidth * .01)
		.css("left", window.innerWidth / 2 - window.innerWidth * .13 * 646 / 189 / 2)
	)
	.append($("<img>").attr("src", "../assets/shared/images/spartanStrike_lowerRedline.png")
		.css("width", window.innerWidth)
		.css("position", "absolute")
		.css("top", window.innerWidth * .17 - window.innerWidth * 14 / 640)
		.css("left", 0)
	);	

	$("#" + Imports.domId["MainMenu"] + " .games-list").css("width", window.innerWidth * .9)
	.css("margin-left", "auto")
	.css("margin-right", "auto");

	$("#" + Imports.domId["MainMenu"] + " .scrollable .label").css("width", window.innerWidth * .4)
	.css("margin-top", window.innerWidth * .03)
	.css("margin-bottom", window.innerWidth * .02);
}

MainMenu.prototype = Object.create(FixedHeightView.prototype);

MainMenu.prototype.onView = function () {
	var that = this;
	this.GameMasterTicket = this.Imports.GameMaster.subscribeGames(this._render.bind(this));
	this.locationTicket = this.Imports.GameMaster.subscribeLocation(function (location) {
		if (location) {
			that.location = location;
		} else {
			// TODO Prompt user to enable location services
			that.Imports.NativeBridge.log("Location services must be enabled for this application to operate as intended.");
		}
	});
	FixedHeightView.prototype.onView.call(this);
};

MainMenu.prototype.offView = function () {
	this.Imports.GameMaster.unsubscribeGames(this.GameMasterTicket);
	this.Imports.GameMaster.unsubscribeLocation(this.locationTicket);
	FixedHeightView.prototype.offView.call(this);
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
			var yourid = that.Imports.GameMaster.userid;
			if (opponentid === that.Imports.GameMaster.userid) {
				opponentid = game.opponent;
			}
			var gameDiv = $("<div></div>")
			.addClass("game")
			.css("background-image", "url(\"../assets/shared/images/spartanStrike_menuBox.png\")")
			.css("background-size", "100% 100%")
			.css("margin-bottom", window.innerWidth * 0.005)
			.css("text-align", "center")
			.css("vertical-align", "center")
			.css("line-height", "1.2em")
			.css("font-size", "36pt")
			.css("width", "100%")
			.css("height", "1.2em")
			.css("overflow", "hidden")
			.click(function () {
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
	var that = this;
	if (!game[this.Imports.GameMaster.userid].base) {
		if (this.location) {
			this.Imports.GameMaster.acceptInvitation(game.id, this.location).done(function (acceptedGame) {
				if (!that.Imports.Views["MapView"]) {
					that.Imports.Views["MapView"] = new MapView(that.Imports);
				}
				that.Imports.Views["MapView"].show(acceptedGame);
			}).fail(function () {
				// TODO Notify user that the service was unreachable
				that.Imports.NativeBridge.log("Service unavailable. Could not accept invitation.");
			});
		} else {
			// TODO Notify user that they haven't got a good location yet
			this.Imports.NativeBridge.log("Your location is needed to accept this invitation. Please try again when you have GPS signal.");
		}
	} else {
		if (!this.Imports.Views["MapView"]) {
			this.Imports.Views["MapView"] = new MapView(this.Imports);
		}
		this.Imports.Views["MapView"].show(game);
	}
};
