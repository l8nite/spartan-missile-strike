/* MissileApp opponents view.
 */
function OpponentsView(Imports) {
	var that = this;
	this.Imports = Imports;
	FixedHeightView.call(this, Imports.domId["OpponentsView"]);

	// $("#" + that.Imports.domId["OpponentsView"])
	// .css("background-image", "url(\"../assets/shared/images/longBG_smaller.jpg\")")
	// .css("background-size", "100%");

	$("#" + Imports.domId["OpponentsView"] + " .bg").css("background-image", "url(\"../assets/shared/images/longBG_smaller.jpg\")")
	.css("background-size", "100%")
	.css("min-height", window.innerHeight - window.innerWidth * .17)
	.css("padding-top", window.innerWidth * .03)
	.css("padding-left", window.innerWidth * .05)
	.css("padding-right", window.innerWidth * .05);

	$("#" + Imports.domId["OpponentsView"] + " .scrollable")
	.css("height", window.innerHeight - window.innerWidth * .17)
	.css("overflow", "scroll");

	$("#" + Imports.domId["OpponentsView"] + " .buttons").css("background-image", "url(\"../assets/shared/images/spartanStrike_header.jpg\")")
	.css("background-size", "100% 100%").css("height", window.innerWidth * .17)
	.css("text-align", "center")
	.append($("<img>").attr("src", "../assets/shared/images/navigationArrow.png")
		.css("height", window.innerWidth * .13)
		.css("position", "absolute")
		.css("top", window.innerWidth * .01)
		.css("left", window.innerWidth * .01)
		.click(function () {
			Imports.ViewManager.previousView();
		})
	)
	.append($("<img>").attr("src", "../assets/shared/images/spartanStrike_chooseOpponent.png")
		.css("height", window.innerWidth * .06)
		.css("position", "absolute")
		.css("top", window.innerWidth * .043)
		.css("left", window.innerWidth / 2 - window.innerWidth * .06 * 518 / 45 / 2)
	)
	.append($("<img>").attr("src", "../assets/shared/images/spartanStrike_lowerRedline.png")
		.css("width", window.innerWidth)
		.css("position", "absolute")
		.css("top", window.innerWidth * .17 - window.innerWidth * 14 / 640)
		.css("left", 0)
	);
}

OpponentsView.prototype = Object.create(FixedHeightView.prototype);

OpponentsView.prototype.onView = function () {
	var that = this;
	this.location = null;
	this.locationTicket = this.Imports.NativeBridge.startLocationUpdates(function (location) {
		if (location) {
			that.location = location;
		} else {
			// TODO Prompt user to enable location services
			that.Imports.NativeBridge.log("Location services must be enabled for this application to operate as intended.");
		}
	});
	this.Imports.GameMaster.getOpponentsFromService().done(function (opponents) {
		$("#" + that.Imports.domId["OpponentsView"] + " .player-list").empty();
		for (var i = 0; i < opponents.length; i++) {
			(function () {
				var opponent = opponents[i];
				$("#" + that.Imports.domId["OpponentsView"] + " .player-list").append(
					$("<div>" + opponent.username + "</div>")
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
						if (that.location) {
							that.Imports.GameMaster.newGame(opponent.id, that.location).done(function (game) {
								if (!that.Imports.Views["MapView"]) {
									that.Imports.Views["MapView"] = new MapView(that.Imports);
								}
								that.Imports.Views["MapView"].show(game);
							}).fail(function () {
								// TODO Notify user that the service was unreachable
								that.Imports.NativeBridge.log("Service unavailable. Could not accept invitation.");
							});
						} else {
							// TODO Notify user that they can't start the game yet!
							that.Imports.NativeBridge.log("Your location is needed to accept this invitation. Please try again when you have GPS signal.");
						}
					})
				);
			})();
		}
	});
	FixedHeightView.prototype.onView.call(this);
};

OpponentsView.prototype.offView = function () {
	this.Imports.NativeBridge.stopLocationUpdates(this.locationTicket);
	FixedHeightView.prototype.offView.call(this);
};

OpponentsView.prototype.show = function () {
	this.Imports.ViewManager.loadView(this);
};
