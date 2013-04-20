/* MissileApp options view.
 */

function OptionsView(Imports) {

    $(function() {
        Imports.NativeBridge.getPreferences(["musicMuted", "sfxMuted"], function(preferences) {
            if (preferences.musicMuted === "0") {
                $('#musicX').show();
            } else {
                $('#musicX').hide();

            }

            if (preferences.sfxMuted == "0") {
                $('#sfxX').show();
            } else {
                $('#sfxX').hide();

            }
        });

        //install the click handlers
        $('#musicButton').click(function() {
            if ($('#musicX').is(':visible')) {
                // if the X is visible, and they clicked it, it means we want to UNMUTE the music
                $('#musicX').hide();
                Imports.NativeBridge.setPreferences({
                    "musicMuted": "0"
                });
            } else {
                // else if the X is hidden, and they clicked it, it means we want to MUTE the music
                $('#musicX').show();
                Imports.NativeBridge.setPreferences({
                    "musicMuted": "1"
                });
            }
        });

        $('#sfxButton').click(function() {
            if ($('#sfxX').is(':visible')) {
                // if the X is visible, and they clicked it, it means we want to UNMUTE the music
                $('#sfxX').hide();
                Imports.NativeBridge.setPreferences({
                    "sfxMuted": "0"
                });

            } else {
                // else if the X is hidden, and they clicked it, it means we want to MUTE the music
                $('#sfxX').show();
                Imports.NativeBridge.setPreferences({
                    "sfxMuted": "1"
                });

            }
        });
    });

    this.Imports = Imports;
    View.call(this, Imports.domId["OptionsView"]);

    $('#clickToDismiss').click(function() {
        Imports.ViewManager.previousView();
    });
}

OptionsView.prototype = Object.create(View.prototype);

OptionsView.prototype.onView = function() {
    View.prototype.onView.call(this);
};

OptionsView.prototype.offView = function() {
    View.prototype.offView.call(this);
};

OptionsView.prototype.show = function() {
    this.Imports.ViewManager.loadView(this);
};

OptionsView.prototype.getTransitionStyle = function() {
    return 'popup';
};
