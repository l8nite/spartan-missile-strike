function MainView() {
    this._viewAnimationQueue = [];
    this._viewStack = [];
    this._animating = false;
}

MainView.prototype.loadView = function (view, arbitraryPrevView) {
    this._viewAnimationQueue.push(this._loadViewAnimation.bind(this, view, arbitraryPrevView));
    this._doAnimation();
};

MainView.prototype.previousView = function (view) {
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

MainView.prototype._loadViewAnimation = function (view, arbitraryPrevView) {
    var that = this;
    if (this._viewStack.length > 0) {
        var oldView = this._viewStack[this._viewStack.length - 1];
        if (view === oldView) {
            this._postAnimation();
            return;
        }
        Imports.DomHelper.moveTo(view, window.innerWidth, 0);
        view.onView();
        this._moveAnimation([view, oldView], window.innerWidth * -1, this._TRANSITIONSPEED, this._SMOOTHING, function () {
            oldView.offView();
            if (arbitraryPrevView) {
                that._viewStack = that._viewStack.slice(0, that._viewStack.indexOf(arbitraryPrevView) + 1);
            }
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
    if (!newView) {
        this._postAnimation();
        return;
    } else if (oldView === newView) {
        that._viewStack.pop();
        this._postAnimation();
        return;
    }
    Imports.DomHelper.moveTo(newView, window.innerWidth * -1, 0);
    newView.onView();
    this._moveAnimation([newView, oldView], window.innerWidth, this._TRANSITIONSPEED, this._SMOOTHING, function () {
        oldView.offView();
        that._viewStack.pop();
        that._postAnimation();
    });
};

MainView.prototype._moveAnimation = function (nodes, translation_x, time, smoothing, then) {
    function doMove() {
        var currentFrameTime = new Date().getTime();
        if (currentFrameTime >= initialTime + time) {
            for (var i in nodes) {
                Imports.DomHelper.moveTo(nodes[i], initialPos[i] + translation_x);
            }
            then();
        }
        else {
            var dt = currentFrameTime - prevFrameTime,
                smoothingFactor = Math.min(
                    (currentFrameTime - initialTime) / (dt + smoothing),
                    (initialTime + actualTime - prevFrameTime + smoothing) / (dt + smoothing),
                    1
                ),
                dx = baseVelocity * dt * smoothingFactor;
            for (var i in nodes) {
                pos[i] += dx;
                Imports.DomHelper.moveTo(nodes[i], pos[i]);
            }
            prevFrameTime = currentFrameTime;
            setTimeout(function () {
                doMove();
            }, 1 / this._MAXFPS - new Date().getTime() + currentFrameTime);
        }
    }

    var actualTime = time - smoothing,
        initialTime = prevFrameTime = new Date().getTime(),
        pos = [],
        initialPos = [],
        baseVelocity = translation_x / actualTime;
    for (var i in nodes) {
        pos[i] = Imports.DomHelper.getPos(nodes[i]).x;
        initialPos[i] = pos[i];
    }
    setTimeout(function () {
        doMove()
    }, 1 / this._MAXFPS - new Date().getTime() + initialTime);
};

MainView.prototype._TRANSITIONSPEED = 200;
MainView.prototype._SMOOTHING = 50;
MainView.prototype._MAXFPS = 60;