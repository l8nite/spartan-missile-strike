/* MissileApp options view.
 */

function OptionsView(Imports) {

    $(function() {
        Imports.NativeBridge.getPreferences(["musicMuted", "sfxMuted"], function(preferences) {
            if (preferences.musicMuted === "0") {
                $('#musicX').hide();
            } else {
                $('#musicX').show();

            }

            if (preferences.sfxMuted == "0") {
                $('#sfxX').hide();
            } else {
                $('#sfxX').show();

            }
        });

        //install the click handlers
        $('#musicButton').click(function(event) {
            event.stopPropagation();
            if ($('#musicX').is(':visible')) {
                // if the X is visible, and they clicked it, it means we want to UNMUTE the music
                $('#musicX').hide();
                Imports.NativeBridge.setPreferences({
                    "musicMuted": "0"
                });
                Imports.NativeBridge.playSound('background_music', { foreground: false, loop: true });
            } else {
                // else if the X is hidden, and they clicked it, it means we want to MUTE the music
                $('#musicX').show();
                Imports.NativeBridge.setPreferences({
                    "musicMuted": "1"
                });
                Imports.NativeBridge.stopSound('background_music');
            }
        });

        $('#sfxButton').click(function(event) {
            event.stopPropagation();
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
                Imports.NativeBridge.stopSound(); // no param = stop all sounds
            }
        });
    });

    this.Imports = Imports;
    View.call(this, Imports.domId["OptionsView"]);

    $('#optionsView > #clickToDismiss').click(function(event) {
        event.stopPropagation();
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
