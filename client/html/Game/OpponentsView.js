/* MissileApp opponents view.
 * 
 * Must copy-paste the OpponentsView.html markup into the app.
 */
function OpponentsView(Imports) {
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["OpponentsView"]);

	$("#" + Imports.domId["OpponentsView"] + " .startBtn").click(function () {
		var opponentid = $("#opponent-input").val();
		if (!that.baseView) {
			that.baseView = new BaseView(Imports);
		}
		that.baseView.show(opponentid);
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
