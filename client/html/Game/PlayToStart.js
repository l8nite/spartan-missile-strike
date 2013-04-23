/* MissileApp Play button screen.
 */
function PlayToStart(Imports) {
	var that = this;
	this.Imports = Imports;
	FixedHeightView.call(this, Imports.domId["PlayToStart"]);

	var playImage = $("<img></img>")
			.attr("src", "assets/images/spartanStrike_play.png")
			.css("position", "absolute")
			.css("top", (((window.innerHeight * .05 + window.innerWidth * .6 * 294 / 402) + (window.innerHeight * .96)) / 2) - ((window.innerWidth * .96 * 494 / 620) / 2) + window.innerWidth * .605)
			.css("left", window.innerWidth * .86 / 2)
			.css("width", window.innerWidth * .14);

	$(playImage).bind('fade-cycle', function () {
		$(this).fadeOut(1000, function () {
			$(this).fadeIn(1000, function () {
				$(this).trigger('fade-cycle');
			});
		});
	});

	$(playImage).trigger('fade-cycle');

	$("#" + Imports.domId["PlayToStart"]).css("background-image", "url(\"assets/images/spartanStrike_BG.jpg\")")
		.css("background-size", "100%")
		.append($("<img></img>")
			.attr("src", "assets/images/spartanStrike_title.png")
			.css("position", "absolute")
			.css("top", window.innerHeight * .025)
			.css("left", window.innerWidth / 2 - window.innerWidth * .3)
			.css("width", window.innerWidth * .6)
		)
		.append($("<img></img>")
			.attr("src", "assets/images/spartanStrike_upperRedline.png")
			.css("position", "absolute")
			.css("top", window.innerHeight * .05 + window.innerWidth * .6 * 294 / 402)
			.css("left", 0)
			.css("width", window.innerWidth)
		)
		.append($("<img></img>")
			.attr("src", "assets/images/spartanStrike_mainIcon.png")
			.css("position", "absolute")
			.css("top", (((window.innerHeight * .05 + window.innerWidth * .6 * 294 / 402) + (window.innerHeight * .96)) / 2) - ((window.innerWidth * .96 * 494 / 620) / 2))
			.css("left", window.innerWidth * .02)
			.css("width", window.innerWidth * .96)
		)
		.append(playImage)
		.append($("<img></img>")
			.attr("src", "assets/images/spartanStrike_lowerRedline.png")
			.css("position", "absolute")
			.css("top", window.innerHeight * .96)
			.css("left", 0)
			.css("width", window.innerWidth)
		)
		.click(function () {
		Imports.NativeBridge.getFacebookAccessToken(function (token) {
			if (token) {
				$.ajax(Imports.serviceurl + "/sessions", {
					type: "POST",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({
						facebook_access_token: token
					})
				}).done(function (response) {
					var sessionid = response.session.id,
						userid = response.user.id,
						isNewUser = response.user.newUser;
					Imports.GameMaster = new GameMaster(userid, sessionid, Imports);
					if (!Imports.Views["MainMenu"]) {
						Imports.Views["MainMenu"] = new MainMenu(Imports);
					}
					Imports.Views["MainMenu"].show();
				}).fail(function (error) {
					that.Imports.NativeBridge.log(JSON.parse(error.responseText));
				});
			}
		});
	});
}

PlayToStart.prototype = Object.create(FixedHeightView.prototype);

PlayToStart.prototype.show = function () {
	this.Imports.ViewManager.loadView(this);
};
