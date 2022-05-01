import Peity from "./peity";
import * as pie from "./renderers/pie";
import * as bar from "./renderers/bar";
import * as line from "./renderers/line";

Peity.register("pie", pie.defaults, pie.renderer);
Peity.register("donut", pie.defaults, pie.renderer);
Peity.register("bar", bar.defaults, bar.renderer);
Peity.register("line", line.defaults, line.renderer);

export * from "./peity";

const peity = function (element, type, options) {
  const peity = new Peity(element, type, options);
  peity.mount();

  return peity;
};

peity.defaults = Peity.defaults;
peity.graphers = Peity.graphers;

export default peity;
