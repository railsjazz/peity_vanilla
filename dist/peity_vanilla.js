/*!
  Peity Vanila JS 0.0.5
  Copyright © 2022 RailsJazz
  https://railsjazz.com
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.peity = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var isFunction = function isFunction(o) {
    return o !== null && typeof o === "function" && !!o.apply;
  };
  var svgElement = function svgElement(tag, attrs) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", tag);

    for (var attr in attrs) {
      element.setAttribute(attr, attrs[attr]);
    }

    return element;
  };
  var svgSupported = "createElementNS" in document && svgElement("svg", {}).createSVGRect();

  var Peity = /*#__PURE__*/function () {
    function Peity(element, type) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, Peity);

      this.element = element;
      this.type = type;
      this.options = Object.assign({}, Peity.defaults[this.type], JSON.parse(element.dataset["peity"] || "{}"), options);

      if (this.element._peity) {
        this.element._peity.destroy();
      }

      this.element._peity = this;
    }

    _createClass(Peity, [{
      key: "draw",
      value: function draw() {
        var options = this.options;
        Peity.graphers[this.type](this);
        if (isFunction(options.after)) options.after.call(this, options);
      }
    }, {
      key: "fill",
      value: function fill() {
        var fill = this.options.fill;
        return isFunction(fill) ? fill : function (_, i) {
          return fill[i % fill.length];
        };
      }
    }, {
      key: "prepare",
      value: function prepare(width, height) {
        if (!this.svg) {
          this.element.style.display = "none";
          this.element.after(this.svg = svgElement("svg", {
            class: "peity"
          }));
        }

        this.svg.innerHTML = "";
        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);
        return this.svg;
      }
    }, {
      key: "values",
      get: function get() {
        return this.element.innerText.split(this.options.delimiter).map(function (value) {
          return parseFloat(value);
        });
      }
    }, {
      key: "mount",
      value: function mount() {
        if (!svgSupported) return;
        this.element.addEventListener("change", this.draw.bind(this));
        this.draw();
        this.mounted = true;
      }
    }, {
      key: "unmount",
      value: function unmount() {
        this.element.removeEventListener("change", this.draw);
        this.svg.remove();
        this.mounted = false;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.unmount();
        delete this.element._peity;
      }
    }], [{
      key: "register",
      value: function register(type, defaults, grapher) {
        Peity.defaults[type] = defaults;
        Peity.graphers[type] = grapher;
      }
    }]);

    return Peity;
  }();

  _defineProperty(Peity, "defaults", {});

  _defineProperty(Peity, "graphers", {});

  var renderer$2 = function renderer(peity) {
    if (!peity.options.delimiter) {
      var delimiter = peity.element.innerText.match(/[^0-9\.]/);
      peity.options.delimiter = delimiter ? delimiter[0] : ",";
    }

    var values = peity.values.map(function (n) {
      return n > 0 ? n : 0;
    });

    if (peity.options.delimiter == "/") {
      var v1 = values[0];
      var v2 = values[1];
      values = [v1, Math.max(0, v2 - v1)];
    }

    var i = 0;
    var length = values.length;
    var sum = 0;

    for (; i < length; i++) {
      sum += values[i];
    }

    if (!sum) {
      length = 2;
      sum = 1;
      values = [0, 1];
    }

    var diameter = peity.options.radius * 2;
    var svg = peity.prepare(peity.options.width || diameter, peity.options.height || diameter);
    var width = svg.clientWidth;
    var height = svg.clientHeight;
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.min(cx, cy);
    var innerRadius = peity.options.innerRadius;

    if (peity.type == "donut" && !innerRadius) {
      innerRadius = radius * 0.5;
    }

    var fill = peity.fill();

    var scale = function scale(value, radius) {
      var radians = value / sum * Math.PI * 2 - Math.PI / 2;
      return [radius * Math.cos(radians) + cx, radius * Math.sin(radians) + cy];
    };

    var cumulative = 0;

    for (i = 0; i < length; i++) {
      var value = values[i];
      var portion = value / sum;
      var node = void 0;
      if (portion == 0) continue;

      if (portion == 1) {
        if (innerRadius) {
          var x2 = cx - 0.01;
          var y1 = cy - radius;
          var y2 = cy - innerRadius;
          node = svgElement("path", {
            d: ["M", cx, y1, "A", radius, radius, 0, 1, 1, x2, y1, "L", x2, y2, "A", innerRadius, innerRadius, 0, 1, 0, cx, y2].join(" "),
            "data-value": value
          });
        } else {
          node = svgElement("circle", {
            cx: cx,
            cy: cy,
            "data-value": value,
            r: radius
          });
        }
      } else {
        var cumulativePlusValue = cumulative + value;
        var d = ["M"].concat(scale(cumulative, radius), "A", radius, radius, 0, portion > 0.5 ? 1 : 0, 1, scale(cumulativePlusValue, radius), "L");

        if (innerRadius) {
          d = d.concat(scale(cumulativePlusValue, innerRadius), "A", innerRadius, innerRadius, 0, portion > 0.5 ? 1 : 0, 0, scale(cumulative, innerRadius));
        } else {
          d.push(cx, cy);
        }

        cumulative += value;
        node = svgElement("path", {
          d: d.join(" "),
          "data-value": value
        });
      }

      node.setAttribute("fill", fill.call(peity, value, i, values));
      svg.append(node);
    }
  };
  var defaults$2 = {
    fill: ["#ff9900", "#fff4dd", "#ffc66e"],
    radius: 8
  };

  var renderer$1 = function renderer(peity) {
    var values = peity.values;
    var max = Math.max.apply(Math, peity.options.max == undefined ? values : values.concat(peity.options.max));
    var min = Math.min.apply(Math, peity.options.min == undefined ? values : values.concat(peity.options.min));
    var svg = peity.prepare(peity.options.width, peity.options.height);
    var width = svg.clientWidth;
    var height = svg.clientHeight;
    var diff = max - min;
    var padding = peity.options.padding;
    var fill = peity.fill();

    var xScale = function xScale(input) {
      return input * width / values.length;
    };

    var yScale = function yScale(input) {
      return height - (diff ? (input - min) / diff * height : 1);
    };

    for (var i = 0; i < values.length; i++) {
      var x = xScale(i + padding);
      var w = xScale(i + 1 - padding) - x;
      var value = values[i];
      var valueY = yScale(value);
      var y1 = valueY;
      var y2 = valueY;
      var h = void 0;

      if (!diff) {
        h = 1;
      } else if (value < 0) {
        y1 = yScale(Math.min(max, 0));
      } else {
        y2 = yScale(Math.max(min, 0));
      }

      h = y2 - y1;

      if (h == 0) {
        h = 1;
        if (max > 0 && diff) y1--;
      }

      svg.append(svgElement("rect", {
        "data-value": value,
        fill: fill.call(peity, value, i, values),
        x: x,
        y: y1,
        width: w,
        height: h
      }));
    }
  };
  var defaults$1 = {
    delimiter: ",",
    fill: ["#4D89F9"],
    height: 16,
    min: 0,
    padding: 0.1,
    width: 32
  };

  var renderer = function renderer(peity) {
    var values = peity.values;
    if (values.length == 1) values.push(values[0]);
    var max = Math.max.apply(Math, peity.options.max == undefined ? values : values.concat(peity.options.max));
    var min = Math.min.apply(Math, peity.options.min == undefined ? values : values.concat(peity.options.min));
    var svg = peity.prepare(peity.options.width, peity.options.height);
    var strokeWidth = peity.options.strokeWidth;
    var width = svg.clientWidth;
    var height = svg.clientHeight - strokeWidth;
    var diff = max - min;

    var xScale = function xScale(input) {
      return input * (width / (values.length - 1));
    };

    var yScale = function yScale(input) {
      var y = height;

      if (diff) {
        y -= (input - min) / diff * height;
      }

      return y + strokeWidth / 2;
    };

    var zero = yScale(Math.max(min, 0));
    var coords = [0, zero];

    for (var i = 0; i < values.length; i++) {
      coords.push(xScale(i), yScale(values[i]));
    }

    coords.push(width, zero);

    if (peity.options.fill) {
      svg.append(svgElement("polygon", {
        fill: peity.options.fill,
        points: coords.join(" ")
      }));
    }

    if (strokeWidth) {
      svg.append(svgElement("polyline", {
        fill: "none",
        points: coords.slice(2, coords.length - 2).join(" "),
        stroke: peity.options.stroke,
        "stroke-width": strokeWidth,
        "stroke-linecap": "square"
      }));
    }
  };
  var defaults = {
    delimiter: ",",
    fill: "#c6d9fd",
    height: 16,
    min: 0,
    stroke: "#4d89f9",
    strokeWidth: 1,
    width: 32
  };

  Peity.register("pie", defaults$2, renderer$2);
  Peity.register("donut", defaults$2, renderer$2);
  Peity.register("bar", defaults$1, renderer$1);
  Peity.register("line", defaults, renderer);

  var peity = function peity(element, type, options) {
    var peity = new Peity(element, type, options);
    peity.mount();
    return peity;
  };

  peity.defaults = Peity.defaults;
  peity.graphers = Peity.graphers;

  return peity;

}));
//# sourceMappingURL=peity_vanilla.js.map
