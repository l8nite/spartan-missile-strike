(function () {
	var DomHelper = {};

	DomHelper.addClass = function (node, classname) {
		var classes = node._domNode.getAttribute("class");
		if (!classes) {
			node._domNode.setAttribute("class", classname);
		} else if (classes.indexOf(classname) === -1) {
			node._domNode.setAttribute("class", classes + " " + classname);
		}
	};

	DomHelper.removeClass = function (node, classname) {
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

	DomHelper.moveTo = function (node, x, y, z) {
		if (!node._domNode._coords) {
			node._domNode._coords = {
				x: 0,
				y: 0,
				z: 0
			};
		}
		if (x !== undefined) {
			node._domNode._coords.x = x;
		}
		if (y !== undefined) {
			node._domNode._coords.y = y;
		}
		if (z !== undefined) {
			node._domNode._coords.z = z;
		}

		node._domNode.style.webkitTransform = "translate3d(" +
			node._domNode._coords.x + "px," +
			node._domNode._coords.y + "px," +
			node._domNode._coords.z + "px)";
	};

	DomHelper.getPos = function (node) {
		return node._domNode._coords ? node._domNode._coords : {
			x: 0,
			y: 0,
			z: 0
		};
	};

	window.DomHelper = DomHelper;
})();
