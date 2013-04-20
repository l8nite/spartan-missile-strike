/* MissileApp opponents view.
 */
function OpponentsView(Imports) {
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["OpponentsView"]);

	$("#" + that.Imports.domId["OpponentsView"])
	.css("background-image", "url(\"../shared/Image Assets/spartanStrike_BG.png\")")
	.css("background-size", "100%");

	$("#" + Imports.domId["OpponentsView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
}

OpponentsView.prototype = Object.create(View.prototype);

OpponentsView.prototype.onView = function () {
	var that = this;
	this.Imports.GameMaster.getOpponentsFromService().done(function (opponents) {
		$("#" + that.Imports.domId["OpponentsView"] + " .player-list").empty();
		for (var i = 0; i < opponents.length; i++) {
			(function () {
				var opponent = opponents[i];
				$("#" + that.Imports.domId["OpponentsView"] + " .player-list").append(
					$("<div>" + opponent.username + "</div>")
					.click(function () {
						if (!that.Imports.Views["BaseView"]) {
							that.Imports.Views["BaseView"] = new BaseView(that.Imports);
						}
						that.Imports.Views["BaseView"].show(opponent.id);
					})
				);
			})();
		}
	});
	View.prototype.onView.call(this);
};

OpponentsView.prototype.offView = function () {
	View.prototype.offView.call(this);
};

OpponentsView.prototype.show = function () {
	this.Imports.ViewManager.loadView(this);
};
