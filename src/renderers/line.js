import { svgElement } from "../utils";

export const renderer = (peity) => {
  const values = peity.values;
  if (values.length == 1) values.push(values[0]);
  const max = Math.max.apply(
    Math,
    peity.options.max == undefined ? values : values.concat(peity.options.max)
  );
  const min = Math.min.apply(
    Math,
    peity.options.min == undefined ? values : values.concat(peity.options.min)
  );

  const svg = peity.prepare(peity.options.width, peity.options.height);
  const strokeWidth = peity.options.strokeWidth;
  const width = svg.clientWidth;
  const height = svg.clientHeight - strokeWidth;
  const diff = max - min;

  const xScale = (input) => {
    return input * (width / (values.length - 1));
  };

  const yScale = (input) => {
    let y = height;

    if (diff) {
      y -= ((input - min) / diff) * height;
    }

    return y + strokeWidth / 2;
  };

  let zero = yScale(Math.max(min, 0));
  let coords = [0, zero];

  for (var i = 0; i < values.length; i++) {
    coords.push(xScale(i), yScale(values[i]));
  }

  coords.push(width, zero);

  if (peity.options.fill) {
    svg.append(
      svgElement("polygon", {
        fill: peity.options.fill,
        points: coords.join(" "),
      })
    );
  }

  if (strokeWidth) {
    svg.append(
      svgElement("polyline", {
        fill: "none",
        points: coords.slice(2, coords.length - 2).join(" "),
        stroke: peity.options.stroke,
        "stroke-width": strokeWidth,
        "stroke-linecap": "square",
      })
    );
  }
};

export const defaults = {
  delimiter: ",",
  fill: "#c6d9fd",
  height: 16,
  min: 0,
  stroke: "#4d89f9",
  strokeWidth: 1,
  width: 32,
};
