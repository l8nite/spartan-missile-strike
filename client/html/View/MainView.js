function MainView() {}

MainView.prototype.loadView = function (view) {
	view.onView();
	this._clearActiveView();
	this._activeView = view;
};

MainView.prototype._clearActiveView = function () {
	if (this._activeView) {
		this._activeView.offView();
		this._activeView = null;
	}
};