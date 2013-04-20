/* MissileApp fire screen.
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

	var scope = $("<img src=\"../shared/Image Assets/spartanStrike_scope.png\">")
	.css("position", "absolute")
	.css("z-index", "-1")
	.css("width", width * .9)
	.css("left", width * .05)
	.css("top", height * .5 - width * .45);

	var bigRedButton = $("<img src=\"../shared/Image Assets/spartanStrike_redButton.png\">")
	.css("position", "absolute")
	.css("width", width * .6)
	.css("left", width * .2)
	.css("top", height - (width * .6) * 164 / 272)
	.click(function () {
		Imports.GameMaster.doFire(that._game, that._location, that._orientation, 100);
		Imports.ViewManager.previousView();
	});

	var backbutton = $("<img src=\"../shared/Image Assets/spartanStrike_mapViewIcon.png\">")
	.css("position", "absolute")
	.css("top", window.innerWidth * .05)
	.css("left", window.innerWidth * .05)
	.css("width", window.innerWidth * .15)
	.click(function () {
		Imports.ViewManager.previousView();
	});

	$("#" + Imports.domId["FireView"])
	.append(backbutton)
	.append(scope)
	.append(bigRedButton);
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
