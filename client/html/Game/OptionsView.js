/* MissileApp options view.
 */
function OptionsView(Imports) {
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["OptionsView"]);

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
