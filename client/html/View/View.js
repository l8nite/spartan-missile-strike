function View(domNode) {
    this._domNode = document.getElementById(domNode);
    if (this._domNode) {
        DomHelper.addClass(this, "view");
        document.body.appendChild(this._domNode);
    }
    else {
        console.error("Could not attatch View to domNode!");
    }
}

View.prototype.onView = function () {
    DomHelper.addClass(this, "active-view");
};

View.prototype.offView = function () {
    DomHelper.removeClass(this, "active-view");
};
