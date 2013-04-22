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

        // BEWARE: thar be dragons here
        // 62% of screen width, 3:2 aspect ratio 
        var size = {};
        size.width = $(window).width() * 0.62;
        size.height = (size.width * 2) / 3;

        // horizontally centered, 15% from top of screen
        var position = {
            left: ($(window).width() - size.width) / 2,
            top: $(window).height() * 0.15
        };

        var optionsImage = $('#options-view #options-image');
        var musicButton = $('#options-view #musicButton');
        var sfxButton = $('#options-view #sfxButton');
        var musicX = $('#options-view #musicX');
        var sfxX = $('#options-view #sfxX');

        $(optionsImage).css({
            'width' : size.width,
            'height' : size.height,
            'left': position.left,
            'top': position.top,
            'position': 'absolute',
        });

        $(musicButton).css({
            'width': size.width / 2,
            'height': size.height,
            'left': position.left,
            'top': position.top,
            'position': 'absolute',
        });

        $(sfxButton).css({
            'width': size.width / 2,
            'height': size.height,
            'left': position.left + size.width / 2,
            'top': position.top,
            'position': 'absolute',
        });

        // "X" is 21% and 31% of width/height, positions are custom offsets because the options image isn't uniformly centered
        var xSize = {};
        xSize.width = (size.width) * 0.21;
        xSize.height = (size.height) * 0.31;

        $(musicX).css({
            'width': xSize.width,
            'height': xSize.height,
            'left': $(musicButton).position().left + ($(musicButton).width() * 0.59 - xSize.width / 2),
            'top': $(musicButton).position().top + ($(musicButton).height() * 0.56 - xSize.height / 2),
            'position': 'absolute',
        });

        $('#options-view #sfxX').css({
            'width': xSize.width,
            'height': xSize.height,
            'left': $(sfxButton).position().left + ($(sfxButton).width() * 0.40 - xSize.width / 2),
            'top': $(sfxButton).position().top + ($(sfxButton).height() * 0.56 - xSize.height / 2),
            'position': 'absolute',
        });

        // install handler to dismiss the options view if the user clicks outside of the box
        $('#options-view #clickToDismiss').click(function(event) {
            event.stopPropagation();
            Imports.ViewManager.previousView();
        });
    });

    this.Imports = Imports;
    View.call(this, Imports.domId["OptionsView"]);
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
