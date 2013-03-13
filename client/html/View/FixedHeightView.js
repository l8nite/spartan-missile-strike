function FixedHeightView(domNode) {
	View.call(this, domNode);
	if (this._domNode) {
        Imports.DomHelper.addClass(this, "fixed-height-view");
    }
}

FixedHeightView.prototype = Object.create(View.prototype);