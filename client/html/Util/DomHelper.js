function DomHelper() {}

DomHelper.prototype.addClass = function (node, classname) {
	var classes = node.getAttribute("class");
	if (!classes) {
		node.setAttribute("class", classname);
	} else if (classes.indexOf(classname) === -1) {
		node.setAttribute("class", classes + " " + classname);
	}
};

DomHelper.prototype.removeClass = function (node, classname) {
	var classes = node.getAttribute("class");
	if (classes) {
		var classesArr = classes.split(" ");
		var newclasses = [];
		for (var i in classesArr) {
			if (classesArr[i] !== classname) {
				newclasses.push(classesArr[i]);
			}
		}
		if (newclasses.length > 0) {
			node.setAttribute("class", newclasses.join(" "));
		} else {
			node.removeAttribute("class");
		}
	}
};