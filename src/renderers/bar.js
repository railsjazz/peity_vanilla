import { svgElement } from "../utils";

export const renderer = (peity) => {
  const values = peity.values;
  const max = Math.max.apply(
    Math,
    peity.options.max == undefined ? values : values.concat(peity.options.max)
  );
  const min = Math.min.apply(
    Math,
    peity.options.min == undefined ? values : values.concat(peity.options.min)
  );

  const svg = peity.prepare(peity.options.width, peity.options.height);
  const width = svg.clientWidth;
  const height = svg.clientHeight;
  const diff = max - min;
  const padding = peity.options.padding;
  const fill = peity.fill();

  const xScale = (input) => {
    return (input * width) / values.length;
  };

  const yScale = (input) => {
    return height - (diff ? ((input - min) / diff) * height : 1);
  };

  for (var i = 0; i < values.length; i++) {
    let x = xScale(i + padding);
    let w = xScale(i + 1 - padding) - x;
    let value = values[i];
    let valueY = yScale(value);
    let y1 = valueY;
    let y2 = valueY;
    let h;

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

    svg.append(
      svgElement("rect", {
        "data-value": value,
        fill: fill.call(peity, value, i, values),
        x: x,
        y: y1,
        width: w,
        height: h,
      })
    );
  }
};

export const defaults = {
  delimiter: ",",
  fill: ["#4D89F9"],
  height: 16,
  min: 0,
  padding: 0.1,
  width: 32,
};
