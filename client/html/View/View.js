function View(domNode, Imports) {
	this.Imports = Imports;
    this._domNode = document.getElementById(domNode);
    if (this._domNode) {
        this.Imports.DomHelper.addClass(this, "view");
    }
    else {
        console.error("Could not attatch View to domNode!");
    }
}

View.prototype.onView = function () {
    this.Imports.DomHelper.addClass(this, "active-view");
};

View.prototype.offView = function () {
    this.Imports.DomHelper.removeClass(this, "active-view");
};