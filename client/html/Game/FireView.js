/* MissileApp fire screen.
 * 
 * Must copy-paste markup into the app.
 */
function FireView(Imports) {
	var that = this;
	this.Imports = Imports;
	this._location = {
		latitude: 0,
		longitude: 0
	};
	this._orientation = {
		azimuth: 0,
		altitude: 0
	};

	FixedHeightView.call(this, Imports.domId["FireView"]);

	var width = window.innerWidth;
	var height = window.innerHeight;

	var scope = $("<img src=\"../shared/Image Assets/spartanStrike_scope.png\">");
	scope.css("position", "absolute");
	scope.css("z-index", "-1");
	scope.css("width", width * .9);
	scope.css("left", width * .05);
	scope.css("top", height * .5 - width * .45);

	var bigredbutton = $("<img src=\"../shared/Image Assets/spartanStrike_redButton.png\">");
	bigredbutton.css("position", "absolute");
	bigredbutton.css("width", width * .6);
	bigredbutton.css("left", width * .2);
	bigredbutton.css("top", height - (width * .6) * 164 / 272);
	bigredbutton.click(function () {
		Imports.GameMaster.doFire(that._game, that._location, that._orientation, 100);
		Imports.ViewManager.previousView();
	});

	var fireview = $("#" + Imports.domId["FireView"]);
	fireview.append(scope);
	fireview.append(bigredbutton);
}

FireView.prototype = Object.create(FixedHeightView.prototype);

FireView.prototype.onView = function () {
	this.Imports.NativeBridge.showFireMissileScreen();
	this.NBLocationTicket = this.Imports.NativeBridge.startLocationUpdates(this._updateWithNewLocation.bind(this));
	this.NBOrientationTicket = this.Imports.NativeBridge.startOrientationUpdates(this._updateWithNewOrientation.bind(this));
	FixedHeightView.prototype.onView.call(this);
};

FireView.prototype.offView = function () {
	this.Imports.NativeBridge.hideFireMissileScreen();
	this.Imports.NativeBridge.stopLocationUpdates(this.NBLocationTicket);
	this.Imports.NativeBridge.stopOrientationUpdates(this.NBOrientationTicket);
	FixedHeightView.prototype.offView.call(this);
};

FireView.prototype.show = function (game) {
	this._game = game;
	this.Imports.ViewManager.loadView(this);
};

FireView.prototype._updateWithNewLocation = function (loc) {
	this._location = loc;

	$("#" + this.Imports.domId["FireView"] + " .gps").text(JSON.stringify(loc));
};

FireView.prototype._updateWithNewOrientation = function (orientation) {
	this._orientation = orientation;

	$("#" + this.Imports.domId["FireView"] + " .orientation").text(JSON.stringify(orientation));
};
