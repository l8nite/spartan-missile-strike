/* MissileApp options view.
 */
 
 

 jQuery(function(){
    jQuery('.MusicOn').live("click", function(e){
        var src = $(this).attr("src");
        $(this).attr("src", $(this).data("altsrc"));
        $(this).data("altsrc", src);
    });
});


function OptionsView(Imports) {
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


 
// function func()
// {
// var afterImageClick = document.createElement("afterClick");
// afterImageClick.src = "./images/musicOn.png";
// 
// document.getElementById('musicToggle').onclick = function() {
//        if (document.getElementById('yes').checked) {
//            alert('music on');
//        } else  (document.getElementById('no').checked) {
//            alert('music on');
//        } 
//        }
// 
// }
//  


