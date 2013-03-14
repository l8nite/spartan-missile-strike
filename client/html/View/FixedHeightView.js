function FixedHeightView(domNode, Imports) {
	View.call(this, domNode, Imports);
	if (this._domNode) {
        Imports.DomHelper.addClass(this, "fixed-height-view");
    }
}

FixedHeightView.prototype = Object.create(View.prototype);