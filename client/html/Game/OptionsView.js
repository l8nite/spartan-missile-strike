/* MissileApp options view.
 */

function OptionsView(Imports) {

        $(function () {
            $('#musicButton').click(function () {
                if ($('#musicX').is(':visible')) {
                    // if the X is visible, and they clicked it, it means we want to UNMUTE the music
                    $('#musicX').hide();
					NativeBridge.setPreference({"soundEffectMuted":"0"});
                }
                else {
                    // else if the X is hidden, and they clicked it, it means we want to MUTE the music
                    $('#musicX').show();
                    NativeBridge.setPreference({"soundEffectOn":"1"});

                }
            });

            $('#sfxButton').click(function () {
                if ($('#sfxX').is(':visible')) {
                    // if the X is visible, and they clicked it, it means we want to UNMUTE the music
                    $('#sfxX').hide();
                    NativeBridge.setPreference({"sfxMuted":"0"});

                }
                else {
                    // else if the X is hidden, and they clicked it, it means we want to MUTE the music
                    $('#sfxX').show();
                    NativeBridge.setPreference({"sfxOn":"1"});

                }
            });
        });
 
 
	var that = this;
	this.Imports = Imports;
	View.call(this, Imports.domId["OptionsView"]);

	$("#" + Imports.domId["OptionsView"] + " .backBtn").click(function () {
		Imports.ViewManager.previousView();
	});
	
		$("#" + Imports.domId["OptionsView"] + " .sfxToggle").click(function () {
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
