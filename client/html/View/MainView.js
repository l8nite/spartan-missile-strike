function MainView() {
    this._viewAnimationQueue = [];
    this._viewStack = [];
    this._animating = false;
}

MainView.prototype.loadView = function (view) {
    this._viewAnimationQueue.push(this._loadViewAnimation.bind(this, view));
    this._doAnimation();
};

MainView.prototype.previousView = function () {
    this._viewAnimationQueue.push(this._previousViewAnimation.bind(this));
    this._doAnimation();
};

MainView.prototype._doAnimation = function () {
    if (!this._animating) {
        this._animating = true;
        this._viewAnimationQueue.shift()();
    }
};

MainView.prototype._postAnimation = function () {
    this._animating = false;
    if (this._viewAnimationQueue.length > 0) {
        this._doAnimation();
    }
};

MainView.prototype._loadViewAnimation = function (view) {
    var that = this;
    if (this._viewStack.length > 0) {
        var oldView = this._viewStack[this._viewStack.length - 1];
        Imports.DomHelper.moveTo(view, window.innerWidth, 0);
        view.onView();
        this._moveAnimation([view, oldView], {
            x: window.innerWidth * -1,
            y: 0
        }, this._TRANSITIONSPEED, function () {
            oldView.offView();
            that._viewStack.push(view);
            that._postAnimation();
        });
    } else {
        Imports.DomHelper.moveTo(view, 0, 0);
        view.onView();
        this._viewStack.push(view);
        this._postAnimation();
    }
};

MainView.prototype._previousViewAnimation = function () {
    var that = this;
    var oldView = this._viewStack[this._viewStack.length - 1];
    var newView = this._viewStack[this._viewStack.length - 2];
    Imports.DomHelper.moveTo(newView, window.innerWidth * -1, 0);
    newView.onView();
    this._moveAnimation([newView, oldView], {
        x: window.innerWidth, 
        y: 0
    }, this._TRANSITIONSPEED, function () {
        oldView.offView();
        that._viewStack.pop();
        that._postAnimation();
    });
};

MainView.prototype._moveAnimation = function (nodes, translation, time, then) {
    var currentPos,
        n;
    for (n in nodes) {
        currentPos = Imports.DomHelper.getPos(nodes[n]);
        Imports.DomHelper.moveTo(nodes[n], currentPos.x + translation.x, currentPos.y + translation.y);
    }
    then();
};

MainView.prototype._TRANSITIONSPEED = 200;
MainView.prototype._MAXFPS = 60;