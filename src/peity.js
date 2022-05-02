import { isFunction, svgElement, svgSupported } from "./utils";

class Peity {
  static defaults = {};
  static graphers = {};

  constructor(element, type, options = {}) {
    this.element = element;
    this.type = type;
    this.options = Object.assign(
      {},
      Peity.defaults[this.type],
      JSON.parse(element.dataset["peity"] || "{}"),
      options
    );

    if(this.element._peity) {
      this.element._peity.destroy();
    }
    this.element._peity = this;
  }

  draw() {
    const options = this.options;
    Peity.graphers[this.type](this);
    if (isFunction(options.after)) options.after.call(this, options);
  }

  fill() {
    var fill = this.options.fill;

    return isFunction(fill)
      ? fill
      : function (_, i) {
          return fill[i % fill.length];
        };
  }

  prepare(width, height) {
    if (!this.svg) {
      this.element.style.display = "none";
      this.element.after(
        (this.svg = svgElement("svg", {
          class: "peity",
        }))
      );
    }

    this.svg.innerHTML = "";
    this.svg.setAttribute("width", width);
    this.svg.setAttribute("height", height);

    return this.svg;
  }

  get values() {
    return this.element.innerText
      .split(this.options.delimiter)
      .map((value) => parseFloat(value));
  }

  mount() {
    if (!svgSupported) return;

    this.element.addEventListener("change", this.draw.bind(this));
    this.draw();

    this.mounted = true;
  }

  unmount() {
    this.element.removeEventListener("change", this.draw);
    this.svg.remove();
    this.mounted = false;
  }

  destroy() {
    this.unmount();

    delete this.element._peity;
  }

  static register(type, defaults, grapher) {
    Peity.defaults[type] = defaults;
    Peity.graphers[type] = grapher;
  }
}

export default Peity;
