/* MissileApp options view.
 * 
 * Must copy-paste the OpponentsView.html markup into the app.
 */
function OptionsView(Imports) {
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["OptionsView"]);

	$("#" + Imports.domId["Options"] + " .startBtn").click(function () {
		var opponentid = $("#options-input").val();
		if (!Imports.Views["BaseView"]) {
			Imports.Views["BaseView"] = new BaseView(Imports);
		}
		Imports.Views["BaseView"].show(optionsid);
	});
	$("#" + Imports.domId["OptionsView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
}

OptionsView.prototype = Object.create(View.prototype);

OptionsView.prototype.onView = function () {
	View.prototype.onView.call(this);
};

OptionsView.prototype.offView = function () {
	View.prototype.offView.call(this);
};

OptionsView.prototype.show = function () {
	this.Imports.ViewManager.loadView(this);
};
