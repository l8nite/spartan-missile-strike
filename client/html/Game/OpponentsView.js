/* MissileApp opponents view.
 */
function OpponentsView(Imports) {
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["OpponentsView"]);

	$("#" + that.Imports.domId["OpponentsView"])
	.css("background-image", "url(\"../shared/Image Assets/spartanStrike_BG.jpg\")")
	.css("background-size", "100%");

	$("#" + Imports.domId["OpponentsView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
}

OpponentsView.prototype = Object.create(View.prototype);

OpponentsView.prototype.onView = function () {
	var that = this;
	this.location = null;
	this.locationTicket = this.Imports.NativeBridge.startLocationUpdates(function (location) {
		that.location = location;
	});
	this.Imports.GameMaster.getOpponentsFromService().done(function (opponents) {
		$("#" + that.Imports.domId["OpponentsView"] + " .player-list").empty();
		for (var i = 0; i < opponents.length; i++) {
			(function () {
				var opponent = opponents[i];
				$("#" + that.Imports.domId["OpponentsView"] + " .player-list").append(
					$("<div>" + opponent.username + "</div>")
					.click(function () {
						if (that.location) {
							that.Imports.GameMaster.newGame(opponent, that.location).done(function (game) {
								if (!that.Imports.Views["MapView"]) {
									that.Imports.Views["MapView"] = new MapView(that.Imports);
								}
								that.Imports.Views["MapView"].show(game);
							}).fail(function () {
								// TODO Notify user that the service was unreachable
							});
						} else {
							// TODO Notify user that they can't start the game yet!
						}
					})
				);
			})();
		}
	});
	View.prototype.onView.call(this);
};

OpponentsView.prototype.offView = function () {
	this.Imports.NativeBridge.stopLocationUpdates(this.locationTicket);
	View.prototype.offView.call(this);
};

OpponentsView.prototype.show = function () {
	this.Imports.ViewManager.loadView(this);
};
