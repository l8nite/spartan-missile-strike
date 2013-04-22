function MainView() {
    this._viewAnimationQueue = [];
    this._viewStack = [];
    this._animating = false;
}

MainView.prototype.loadView = function (view, arbitraryPrevView) {
    this._viewAnimationQueue.push(this._loadViewAnimation.bind(this, view, arbitraryPrevView));
    this._doAnimation();
};

MainView.prototype.previousView = function () {
    this._viewAnimationQueue.push(this._previousViewAnimation.bind(this));
    this._doAnimation();
};

MainView.prototype.onInitialView = function () {
    return !(this._viewStack.length > 2);
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
        DomHelper.moveTo(view, window.innerWidth, 0);
        view.onView();

        var transitionTime = this._TRANSITION_TIME;
        var nodes = [view];
        if (view.getTransitionStyle() !== 'popup') {
            nodes.push(oldView);
        } else {
            transitionTime = 0;
        }

        this._moveAnimation(nodes, window.innerWidth * -1, transitionTime, this._SMOOTHING, function () {
            if (view.getTransitionStyle() != 'popup') {
                oldView.offView();
            }

            if (arbitraryPrevView) {
                that._viewStack = that._viewStack.slice(0, that._viewStack.indexOf(arbitraryPrevView) + 1);
            }

            that._viewStack.push(view);
            that._postAnimation();
        });
    } else {
        DomHelper.moveTo(view, 0, 0);
        view.onView();
        this._viewStack.push(view);
        this._postAnimation();
    }
};

MainView.prototype._previousViewAnimation = function () {
    var that = this,
        oldView = this._viewStack[this._viewStack.length - 1],
        newView = this._viewStack[this._viewStack.length - 2];
    if (!newView) {
        this._postAnimation();
        return;
    } else if (oldView === newView) {
        this._viewStack.pop();
        this._postAnimation();
        return;
    }

    var transitionTime = this._TRANSITION_TIME;
    var nodes = [oldView];

    if (oldView.getTransitionStyle() !== 'popup') {
        DomHelper.moveTo(newView, window.innerWidth * -1, 0);
        newView.onView();
        nodes.push(newView);
    } else {
        transitionTime = 0;
    }

    this._moveAnimation(nodes, window.innerWidth, transitionTime, this._SMOOTHING, function () {
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
                DomHelper.moveTo(nodes[i], initialPos[i] + translation_x);
            }
            then();
        } else {
            var x = 0,
                t_total = currentFrameTime - initialTime,
                t = Math.min(smoothing, Math.max(t_total, 0));
            x += t * t * velocity / 2 / smoothing;
            t = Math.min(plateauTime, Math.max(t_total - smoothing, 0));
            x += t * velocity;
            t = Math.min(smoothing, Math.max(t_total - smoothing - plateauTime, 0));
            x += (2 * smoothing - t) * velocity * t / 2 / smoothing;
            for (var i in nodes) {
                DomHelper.moveTo(nodes[i], initialPos[i] + x);
            }
            setTimeout(function () {
                doMove();
            }, 1000 / that._MAXFPS - new Date().getTime() + currentFrameTime);
        }
    }

    var that = this,
        initialPos = [],
        initialTime = new Date().getTime(),
        velocity = translation_x / (time - smoothing),
        plateauTime = time - 2 * smoothing;
    for (var i in nodes) {
        initialPos[i] = DomHelper.getPos(nodes[i]).x;
    }
    setTimeout(function () {
        doMove();
    }, 1000 / this._MAXFPS - new Date().getTime() + initialTime);
};

// View transition animation time in milliseconds
MainView.prototype._TRANSITION_TIME = 333;
// Time in milliseconds to seperately accelerate/decelerate transition animations
// _SMOOTHING <= _TRANSITION_TIME / 2
MainView.prototype._SMOOTHING = 111;
// Framerate limiter
MainView.prototype._MAXFPS = 60;
