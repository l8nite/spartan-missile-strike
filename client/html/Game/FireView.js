/* MissileApp fire screen.
 * 
 * Must copy-paste markup into the app.
 */
function FireView(Imports) {
	$("#" + Imports.domId["FireView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
	$("#" + Imports.domId["FireView"] + " .fireBtn").click(function () {
		Imports.GameMaster.doFire(this._game, this._location, this._orientation);
		Imports.ViewManager.previousView();
	});
	FixedHeightView.call(this, Imports.domId["FireView"], Imports);
}

FireView.prototype = Object.create(FixedHeightView.prototype);

FireView.prototype.onView = function () {
	this.NBLocationTicket = this.Imports.NativeBridge.getLocationUpdates(true, this._updateWithNewLocation.bind(this));
	this.NBOrientationTicket = this.Imports.NativeBridge.getOrientationUpdates(true, this._updateWithNewOrientation.bind(this));
	FixedHeightView.prototype.onView.call(this);
};

FireView.prototype.offView = function () {
	this.Imports.NativeBridge.getLocationUpdates(false, this.NBLocationTicket);
	this.Imports.NativeBridge.getOrientationUpdates(false, this.NBOrientationTicket);
	FixedHeightView.prototype.offView.call(this);
};

FireView.prototype.show = function (game) {
	this._game = game;
	this.Imports.ViewManager.loadView(this);

	$("#" + this.Imports.domId["FireView"] + " .game").text(JSON.stringify(game));
};

FireView.prototype._updateWithNewLocation = function (location) {
	this._location = location;

	$("#" + this.Imports.domId["FireView"] + " .gps").text(JSON.stringify(location));
};

FireView.prototype._updateWithNewOrientation = function (orientation) {
	this._orientation = orientation;

	$("#" + this.Imports.domId["FireView"] + " .orientation").text(JSON.stringify(orientation));
};