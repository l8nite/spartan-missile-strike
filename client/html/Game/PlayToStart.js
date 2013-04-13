/* MissileApp Play button screen.
 */
function PlayToStart(Imports) {
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["PlayToStart"]);

	$("#" + Imports.domId["PlayToStart"]).click(function () {
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
					// Now we make the GM and start the game!
					Imports.GameMaster = new GameMaster(userid, sessionid, Imports);
					Imports.Views["MainMenu"] = new MainMenu(Imports);
					Imports.Views["MainMenu"].show();
				});
			}
		});
	});
}

MainMenu.prototype = Object.create(View.prototype);
