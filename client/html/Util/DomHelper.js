function DomHelper() {}

DomHelper.prototype.addClass = function (node, classname) {
    var classes = node._domNode.getAttribute("class");
    if (!classes) {
        node._domNode.setAttribute("class", classname);
    } else if (classes.indexOf(classname) === -1) {
        node._domNode.setAttribute("class", classes + " " + classname);
    }
};

DomHelper.prototype.removeClass = function (node, classname) {
    var classes = node._domNode.getAttribute("class");
    if (classes) {
        var classesArr = classes.split(" ");
        var newclasses = [];
        for (var i in classesArr) {
            if (classesArr[i] !== classname) {
                newclasses.push(classesArr[i]);
            }
        }
        if (newclasses.length > 0) {
            node._domNode.setAttribute("class", newclasses.join(" "));
        } else {
            node._domNode.removeAttribute("class");
        }
    }
};

DomHelper.prototype.moveTo = function (node, x, y) {
    if (x === 0 || x) {
        node._domNode.style.left = x;
    }
    if (x === 0 || y) {
        node._domNode.style.top = y;
    }
};

DomHelper.prototype.getPos = function (node) {
    return {
        x: node._domNode.style.left ? parseInt(node._domNode.style.left.slice(0, -2)) : 0,
        y: node._domNode.style.top ? parseInt(node._domNode.style.top.slice(0, -2)) : 0
    };
};