function View(domNode) {
    this._domNode = document.getElementById(domNode);
    if (this._domNode) {
        Imports.DomHelper.addClass(this._domNode, "view");
    }
    else {
        console.error("Could not attatch View to domNode!");
    }
}

View.prototype.onView = function () {
    Imports.DomHelper.addClass(this._domNode, "active-view");
};

View.prototype.offView = function () {
    Imports.DomHelper.removeClass(this._domNode, "active-view");
};