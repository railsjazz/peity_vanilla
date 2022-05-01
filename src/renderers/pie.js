import { svgElement } from "../utils";

export const renderer = (peity) => {
  if (!peity.options.delimiter) {
    const delimiter = peity.element.innerText.match(/[^0-9\.]/);
    peity.options.delimiter = delimiter ? delimiter[0] : ",";
  }

  let values = peity.values.map((n) => (n > 0 ? n : 0));

  if (peity.options.delimiter == "/") {
    let v1 = values[0];
    let v2 = values[1];
    values = [v1, Math.max(0, v2 - v1)];
  }

  let i = 0;
  let length = values.length;
  let sum = 0;

  for (; i < length; i++) {
    sum += values[i];
  }

  if (!sum) {
    length = 2;
    sum = 1;
    values = [0, 1];
  }

  let diameter = peity.options.radius * 2;

  const svg = peity.prepare(
    peity.options.width || diameter,
    peity.options.height || diameter
  );

  const width = svg.clientWidth;
  const height = svg.clientHeight;
  const cx = width / 2;
  const cy = height / 2;

  const radius = Math.min(cx, cy);
  let innerRadius = peity.options.innerRadius;

  if (peity.type == "donut" && !innerRadius) {
    innerRadius = radius * 0.5;
  }

  const fill = peity.fill();

  const scale = (value, radius) => {
    const radians = (value / sum) * Math.PI * 2 - Math.PI / 2;

    return [radius * Math.cos(radians) + cx, radius * Math.sin(radians) + cy];
  };

  let cumulative = 0;

  for (i = 0; i < length; i++) {
    const value = values[i];
    const portion = value / sum;
    let node;

    if (portion == 0) continue;

    if (portion == 1) {
      if (innerRadius) {
        const x2 = cx - 0.01;
        const y1 = cy - radius;
        const y2 = cy - innerRadius;

        node = svgElement("path", {
          d: [
            "M",
            cx,
            y1,
            "A",
            radius,
            radius,
            0,
            1,
            1,
            x2,
            y1,
            "L",
            x2,
            y2,
            "A",
            innerRadius,
            innerRadius,
            0,
            1,
            0,
            cx,
            y2,
          ].join(" "),
          "data-value": value,
        });
      } else {
        node = svgElement("circle", {
          cx: cx,
          cy: cy,
          "data-value": value,
          r: radius,
        });
      }
    } else {
      const cumulativePlusValue = cumulative + value;

      let d = ["M"].concat(
        scale(cumulative, radius),
        "A",
        radius,
        radius,
        0,
        portion > 0.5 ? 1 : 0,
        1,
        scale(cumulativePlusValue, radius),
        "L"
      );

      if (innerRadius) {
        d = d.concat(
          scale(cumulativePlusValue, innerRadius),
          "A",
          innerRadius,
          innerRadius,
          0,
          portion > 0.5 ? 1 : 0,
          0,
          scale(cumulative, innerRadius)
        );
      } else {
        d.push(cx, cy);
      }

      cumulative += value;

      node = svgElement("path", {
        d: d.join(" "),
        "data-value": value,
      });
    }

    node.setAttribute("fill", fill.call(peity, value, i, values));

    svg.append(node);
  }
};

export const defaults = {
  fill: ["#ff9900", "#fff4dd", "#ffc66e"],
  radius: 8,
};
