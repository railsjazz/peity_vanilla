export const isFunction = (o) =>
  o !== null && typeof o === "function" && !!o.apply;

export const svgElement = (tag, attrs) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (var attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }
  return element;
};

export const svgSupported =
  "createElementNS" in document && svgElement("svg", {}).createSVGRect();
