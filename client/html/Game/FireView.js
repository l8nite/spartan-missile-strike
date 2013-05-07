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

	this.compass = $("<div></div>").css("background-image", "url(\"../assets/shared/images/compassFull.png\")")
	.css("background-repeat", "repeat-x")
	.css("background-size", "auto 100%")
	.css("height", window.innerWidth * .14)
	.css("width", window.innerWidth * .6)
	.css("position", "absolute")
	.css("top", window.innerWidth * 0.005)
	.css("left", window.innerWidth / 2 - window.innerWidth * .6 / 2);

	$("#" + Imports.domId["FireView"])
	.append($("<img src=\"../assets/shared/images/spartanStrike_scope.png\">")
		.css("position", "absolute")
		.css("z-index", "-1")
		.css("width", width * .9)
		.css("left", width * .05)
		.css("top", height * .4 - width * .425)
	)
	.append($("<img src=\"../assets/shared/images/spartanStrike_redButton.png\">")
		.css("position", "absolute")
		.css("width", width * .6)
		.css("left", width * .2)
		.css("top", height - (width * .6) * 164 / 272)
		.click(function () {
			Imports.GameMaster.doFire(that._game, that._location, that._orientation, 100);
			Imports.ViewManager.previousView();
		})
	)
	.append($("<img>").attr("src", "../assets/shared/images/navigationArrow.png")
		.css("height", window.innerWidth * .13)
		.css("position", "absolute")
		.css("top", window.innerWidth * .01)
		.css("left", window.innerWidth * .01)
		.click(function () {
			Imports.ViewManager.previousView();
		})
	)
	.append($("<img>").attr("src", "../assets/shared/images/compassBG.png")
		.css("height", window.innerWidth * .13)
		.css("position", "absolute")
		.css("top", window.innerWidth * .01)
		.css("left", window.innerWidth / 2 - window.innerWidth * .13 * 557 / 99 / 2)
	)
	.append(this.compass);
}

FireView.prototype = Object.create(FixedHeightView.prototype);

FireView.prototype.onView = function () {
	var that = this;
	this.Imports.NativeBridge.showFireMissileScreen();
	this.locationTicket = this.Imports.GameMaster.subscribeLocation(this._updateWithNewLocation.bind(this));
	this.NBOrientationTicket = this.Imports.NativeBridge.startOrientationUpdates(this._updateWithNewOrientation.bind(this));
	this.compassRenderInterval = setInterval(function () {
		if (that._orientation) {
			// 880 x 103
			that.compass.css("background-position-x", window.innerWidth * .6 / 2 - that._orientation.azimuth * window.innerWidth * .14 * 880 / 103 / 2 / Math.PI);
		}
	}, 16);
	FixedHeightView.prototype.onView.call(this);
};

FireView.prototype.offView = function () {
	this.Imports.NativeBridge.hideFireMissileScreen();
	this.Imports.GameMaster.unsubscribeLocation(this.locationTicket);
	this.Imports.NativeBridge.stopOrientationUpdates(this.NBOrientationTicket);
	clearInterval(this.compassRenderInterval);
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
