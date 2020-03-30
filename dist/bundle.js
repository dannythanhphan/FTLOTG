/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

document.addEventListener("DOMContentLoaded", function () {
  var width = 900,
      height = 600,
      maxRadius = Math.min(width, height) / 2 - 5;
  var formatNumber = d3.format(',d');
  var x = d3.scaleLinear().range([0, 2 * Math.PI]).clamp(true);
  var y = d3.scaleSqrt().range([maxRadius * .1, maxRadius]);
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var partition = d3.partition();
  var arc = d3.arc().startAngle(function (d) {
    return x(d.x0);
  }).endAngle(function (d) {
    return x(d.x1);
  }).innerRadius(function (d) {
    return Math.max(0, y(d.y0));
  }).outerRadius(function (d) {
    return Math.max(0, y(d.y1));
  });

  var middleArcLine = function middleArcLine(d) {
    var halfPi = Math.PI / 2;
    var angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    var r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    var middleAngle = (angles[1] + angles[0]) / 2;
    var invertDirection = middleAngle > 0 && middleAngle < Math.PI;

    if (invertDirection) {
      angles.reverse();
    }

    var path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  var textFits = function textFits(d) {
    var CHAR_SPACE = 6;
    var deltaAngle = x(d.x1) - x(d.x0);
    var r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    var perimeter = r * deltaAngle;

    if (d.data.name) {
      return d.data.name.length * CHAR_SPACE < perimeter;
    }
  };

  var svg = d3.select('body').append('svg').style('width', '1500').style('height', '900').attr('viewBox', "".concat(-width / 2, " ").concat(-height / 2, " ").concat(width, " ").concat(height)).on('click', function () {
    return focusOn();
  });
  d3.json("/src/game.json").then(function (root) {
    root = d3.hierarchy(root);
    root.sum(function (d) {
      return d.size;
    });
    var slice = svg.selectAll('g.slice').data(partition(root).descendants());
    slice.exit().remove();
    var newSlice = slice.enter().append('g').attr('class', 'slice').on('click', function (d) {
      d3.event.stopPropagation();
      focusOn(d);
    });
    newSlice.append('title').text(function (d) {
      return d.data.name + '\n' + formatNumber(d.value);
    });
    newSlice.append('path').attr('class', 'main-arc').style('fill', function (d) {
      return color((d.children ? d : d.parent).data.name);
    }).attr('d', arc);
    newSlice.append('path').attr('class', 'hidden-arc').attr('id', function (_, i) {
      return "hiddenArc".concat(i);
    }).attr('d', middleArcLine);
    var text = newSlice.append('text').attr('display', function (d) {
      return textFits(d) ? d.data : 'none';
    });
    text.append('textPath').attr('startOffset', '50%').attr('xlink:href', function (_, i) {
      return "#hiddenArc".concat(i);
    }).text(function (d) {
      return d.data.name;
    }).style('fill', 'none').style('stroke', '#fff').style('stroke-width', 5).style('stroke-linejoin', 'round');
    text.append('textPath').attr('startOffset', '50%').attr('xlink:href', function (_, i) {
      return "#hiddenArc".concat(i);
    }).text(function (d) {
      return d.data.name;
    });
  });

  function focusOn() {
    var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      x0: 0,
      x1: 1,
      y0: 0,
      y1: 1
    };
    var transition = svg.transition().duration(750).tween('scale', function () {
      var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]);
      return function (t) {
        x.domain(xd(t));
        y.domain(yd(t));
      };
    });
    transition.selectAll('path.main-arc').attrTween('d', function (d) {
      return function () {
        return arc(d);
      };
    });
    transition.selectAll('path.hidden-arc').attrTween('d', function (d) {
      return function () {
        return middleArcLine(d);
      };
    });
    transition.selectAll('text').attrTween('display', function (d) {
      return textFits(d) ? null : 'none';
    });
    moveStackToFront();

    function moveStackToFront() {
      svg.selectAll('.slice');
    }
  }
});

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map