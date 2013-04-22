/** 
 * MissileApp map menu.
 */

var map = null;

function MapView(Imports) {
	var that = this;
	this.Imports = Imports;
	FixedHeightView.call(this, Imports.domId["MapView"]);
	$("#" + Imports.domId["MapView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
	$("#" + Imports.domId["MapView"] + " .fireBtn").click(function () {
		if (!Imports.Views["FireView"]) {
			Imports.Views["FireView"] = new FireView(Imports);
		}
		Imports.Views["FireView"].show(that._game);
	});
	
	$(function() {
		var buttonSize = { 'width' : 300,  'height' : 50  };
		$('#map-view .buttons .backBtn').css({
			'top' : (window.innerHeight - buttonSize.height),
			'left' :  0,
			'width' : buttonSize.width,
			'height' : buttonSize.height,
			'position' : 'absolute'
		});
		
		$('#map-view .buttons .fireBtn').css({
			'top' : (window.innerHeight - buttonSize.height),
			'right' : 0,
			'width' : buttonSize.width,
			'height' : buttonSize.height,
			'position' : 'absolute'
		});
	});
}

MapView.prototype = Object.create(FixedHeightView.prototype);

MapView.prototype.onView = function () {
	this._generateMapView();
	this.GameMasterTicket = this.Imports.GameMaster.subscribeGames(this._updateWithNewGames.bind(this));
	this.NBLocationTicket = this.Imports.NativeBridge.startLocationUpdates(this._updateWithNewLocation.bind(this));
	FixedHeightView.prototype.onView.call(this);
};

MapView.prototype.offView = function () {
	this.Imports.GameMaster.unsubscribeGames(this.GameMasterTicket);
	this.Imports.NativeBridge.stopLocationUpdates(this.NBLocationTicket);
	FixedHeightView.prototype.offView.call(this);
};

MapView.prototype.show = function (game) {
	this._game = game;
	this.Imports.ViewManager.loadView(this, this.Imports.Views["MainMenu"]);
};

MapView.prototype._updateWithNewGames = function (games) {
	for (var i in games) {
		if (games[i].id === this._game.id) {
			this._game = games[i];
			this._updateGame();
		}
	}
};

MapView.prototype._updateGame = function () {
	$("#" + this.Imports.domId["MapView"] + " .game").text(JSON.stringify(this._game));
	if (this._game.current === this.Imports.GameMaster.userid && this._game.status === "active") {
		$("#" + this.Imports.domId["MapView"] + " .fireBtn").removeClass("hidden");
	} else {
		$("#" + this.Imports.domId["MapView"] + " .fireBtn").addClass("hidden");
	}
	this._updateMapView();
};

MapView.prototype._updateWithNewLocation = function (loc) {
	this._location = loc;
	this._updateMapView();
};

MapView.prototype._generateMapView = function () {
	if(map === null) {
		map = new Microsoft.Maps.Map(document.getElementById("bingmap"), { 
			credentials: "AodC7AaauHfjsY9pK8qi6U-JN1s1HfroLZiCw3afJUoicmW-CH9RasOjp5hcsmFe",
			mapTypeId: Microsoft.Maps.MapTypeId.road,  // Change map style, types: aerial, birdseye, road
			
			// Limit Functionality
			enableSearchLogo: false,		//Disable search
			showDashboard: false,			//Disable controls
			disableZooming: true,			//Disable Zooming
			disablePanning: true			//Disable Panning
		});
	}
}

MapView.prototype._updateMapView = function () {
	// CUSTOMIZE
	// Time delay
	var showMapZoomLevelDelay = 1000;
	var showMapShotOverlayDelay = 2000;
	
	// Shot Style
	var lastShotColor = new Microsoft.Maps.Color(255, 0, 0, 0); //opacity,rgb
	var lastShotWidth = 3;
	var timeDelta = 1.0 / 100; 	// Smoothness
	
	// Push Pins Styles
	var pushPinOptions_currentUserHitShot = { htmlContent: "<img class=\"bingMapsPushPin\" src=\"assets/images/spartanStrike_optionX.png\">"};
	var pushPinOptions_currentUserMissedShots = { htmlContent: "<img class=\"bingMapsPushPin\" src=\"assets/images/spartanStrike_optionX.png\">"};
	var pushPinOptions_currentUserLocation = { htmlContent: "<img class=\"bingMapsPushPin\" src=\"assets/images/spartanStrike_optionX.png\">"};
	var pushPinOptions_currentUserBase = { htmlContent: "<img class=\"bingMapsPushPin\" src=\"assets/images/spartanStrike_optionX.png\">"};
	var pushPinOptions_opponentBase = { htmlContent: "<img class=\"bingMapsPushPin\" src=\"assets/images/spartanStrike_optionX.png\">"};
	
	// PROCESS Locations
	//Remove existing Pushpins
	for(var i=map.entities.getLength()-1;i>=0;i--) {
		if ((map.entities.get(i) instanceof Microsoft.Maps.Pushpin)
			|| (map.entities.get(i) instanceof Microsoft.Maps.Polyline)) {
			map.entities.removeAt(i);
		}
	}
	
	// Get location
	var currentLocation = this._location;
	// Current User
	var currentUser = this._game[this.Imports.GameMaster.userid];
	// Opponent = if device user is not the creator, use creator, else use opponent 
	var opponent = this._game[(this._game.creator !== this.Imports.GameMaster.userid) ? this._game.creator : this._game.opponent];
	// Get Last Shot Array - if the current user is the device user, then use opponent's last shot, else use current user's last shot
	var mapOverViewShot = (this._game.current === this.Imports.GameMaster.userid) ?  // opponent's last shot
																		opponent.shots :  currentUser.shots; 	// currentUser's last shot

	// Bounding Box
	var boundingBoxLocations = new Array();
	
	// Current User Base
	try {
		if(currentUser !== undefined && currentUser.base.latitude !== undefined && currentUser.base.longitude !== undefined) {
			var currentUserBase = new Microsoft.Maps.Location(currentUser.base.latitude, currentUser.base.longitude);
			var pushPin_currentUserBase = new Microsoft.Maps.Pushpin(currentUserBase, pushPinOptions_currentUserBase);
			map.entities.push(pushPin_currentUserBase);
			boundingBoxLocations.push(currentUserBase);
		}
	}
	catch(err) {
		console.log(err);
	}
	
	// Opponent Base
	try {
		if(opponent !== undefined && opponent.base.latitude !== undefined && opponent.base.longitude !== undefined) {
			var opponentBase = new Microsoft.Maps.Location(opponent.base.latitude, opponent.base.longitude);	
			var pushPin_opponentBase = new Microsoft.Maps.Pushpin(opponentBase, pushPinOptions_opponentBase);
			map.entities.push(pushPin_opponentBase);
			boundingBoxLocations.push(opponentBase);
		}
	}
	catch(err) {
		console.log(err);
	}
	
	// Current User Location
	try {
		if(currentLocation !== undefined && currentLocation.latitude !== undefined && currentLocation.longitude !== undefined) {
			var currentUserLocation = new Microsoft.Maps.Location(currentLocation.latitude, currentLocation.longitude);
			var pushPin_currentUserLocation = new Microsoft.Maps.Pushpin(currentUserLocation, pushPinOptions_currentUserLocation);
			map.entities.push(pushPin_currentUserLocation);
			boundingBoxLocations.push(currentUserLocation);
		}
	}
	catch(err) {
		console.log(err);
	}
	
	// Shots Fired
	try {
		for (var i in currentUser.shots) {
			var shot = currentUser.shots[i];
			var shotLocation = new Microsoft.Maps.Location(shot.destination.latitude, shot.destination.longitude);
			var pushPin_shotFired = new Microsoft.Maps.Pushpin(shotLocation, (shot.hit) ? pushPinOptions_currentUserHitShot : pushPinOptions_currentUserMissedShots );
			map.entities.push(pushPin_shotFired);
			boundingBoxLocations.push(shotLocation);
		}
	}
  	catch(err) {
  		console.log(err);
  	}
	
	// Draw opponent's last shot
	try {
		if(true || mapOverViewShot && mapOverViewShot[mapOverViewShot.length - 1]) {
			var lastShot = mapOverViewShot[mapOverViewShot.length - 1];
			var center = new Object();
			center.latitude = (lastShot.destination.latitude + lastShot.origin.latitude) / 2.0;
			center.longitude = (lastShot.destination.longitude + lastShot.origin.longitude) / 2.0;
			center.latitude += 5 * Math.log(Math.abs((lastShot.destination.latitude - lastShot.origin.latitude)));
			center.longitude += 5 * Math.log(Math.abs((lastShot.destination.longitude - lastShot.origin.longitude)));
			
			var points = new Array();
			for (var t = 0.0; t <= 1.0; t += timeDelta) {
				// Latitude
				var firstTermLat = (1.0 - t * t) * lastShot.origin.latitude;
				var secondTermLat = 2.0 * (1.0 - t) * t * center.latitude;
				var thirdTermLat = t * t * lastShot.destination.latitude;
				var pointLat = firstTermLat + secondTermLat + thirdTermLat;
				
				// Longitude
				var firstTermLong = (1.0 - t * t) * lastShot.origin.longitude;
				var secondTermLong = 2.0 * (1.0 - t) * t * center.longitude;
				var thirdTermLong = t * t * lastShot.destination.longitude;
				var pointLong = firstTermLong + secondTermLong + thirdTermLong;
				
				// Generate Point
				var point = new Microsoft.Maps.Location(pointLat, pointLong);
				points.push(point);
				boundingBoxLocations.push(point);
			}
			
			var curve = new Microsoft.Maps.Polyline(points, {
				strokeColor: lastShotColor,
				strokeThickness: lastShotWidth
			});
			setTimeout(function(bingyMappyTwo, overlapOps) {
				bingyMappyTwo.entities.push(overlapOps);
			}, showMapShotOverlayDelay, map, curve);
		}
	}
	catch(err) {
		console.log(err);
	}
	
	// create new view options and call after a few seconds (fixes zoom issue on new map)
	var mapOptions = { bounds: Microsoft.Maps.LocationRect.fromLocations(boundingBoxLocations), animate: true };
	setTimeout(function(bingyMappy, viewOps) {
		bingyMappy.setView(viewOps);
	}, showMapZoomLevelDelay, map, mapOptions);
}
