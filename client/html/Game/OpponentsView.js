/* MissileApp opponents view.
 */
function OpponentsView(Imports) {
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["OpponentsView"]);

	$("#" + Imports.domId["OpponentsView"] + " .startBtn").click(function () {
		var opponentid = $("#opponent-input").val();
		if (!Imports.Views["BaseView"]) {
			Imports.Views["BaseView"] = new BaseView(Imports);
		}
		Imports.Views["BaseView"].show(opponentid);
	});
	$("#" + Imports.domId["OpponentsView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
}

OpponentsView.prototype = Object.create(View.prototype);

OpponentsView.prototype.onView = function () {
	View.prototype.onView.call(this);
};

OpponentsView.prototype.offView = function () {
	View.prototype.offView.call(this);
};

OpponentsView.prototype.show = function () {
	this.Imports.ViewManager.loadView(this);
};
