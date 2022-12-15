import { getScreenSize } from "./common";
import $ from "jquery";

export function svg_main() {
  let grabbing = false;
  let screen = getScreenSize();

  let grabStartPos = {
    x: 0,
    y: 0,
  };
  let svgPos = {
    x: 0,
    y: 0,
  };
  let svgElem = document.querySelector("svg");
  let originalSVG: Element["outerHTML"];
  if (svgElem) {
    originalSVG = svgElem.outerHTML;

    let init_w = svgElem.width.animVal.value;
    let init_h = svgElem.height.animVal.value;

    svgElem.style.position = "absolute";
    svgElem.style.width = init_w + "px";
    svgElem.style.height = init_h + "px";

    // set initial pos
    svgElem.style.left = (screen.w - init_w) / 2 + "px";
    svgElem.style.top = (screen.h - init_h) / 2 + "px";
  }
  svgElem?.addEventListener("mousedown", (e) => {
    grabbing = true;
    grabStartPos.x = e.pageX;
    grabStartPos.y = e.pageY;
    let svg = document.querySelector("svg");
    if (svg) {
      svgPos.x = svg_getStyleVal(svg, "left");
      svgPos.y = svg_getStyleVal(svg, "top");
    }
  });
  let win = $(window);
  win.on("mouseup", (e) => {
    grabbing = false;
  });
  win.on("mousemove", (e) => {
    if (svgElem) svgElem.style.cursor = "pointer";
    if (grabbing) {
      let svg = document.querySelector("svg");

      let cursorDiffX = e.pageX - grabStartPos.x;
      let cursorDiffY = e.pageY - grabStartPos.y;
      if (svg) {
        svg.style.left = `${svgPos.x + cursorDiffX}px`;
        svg.style.top = `${svgPos.y + cursorDiffY}px`;
      }
    }
  });
  // TODO: Adjust SVG position on window resized
  // win.on("resize", (e) => {});
  svgElem?.addEventListener("wheel", (e) => svg_zoom(e), {
    passive: false,
  });
  win.on("keypress", (e) => {
    switch (e.key) {
      case "c": {
        navigator.clipboard.writeText(originalSVG.toString());
        break;
      }
      default:
        break;
    }
  });
}

/**
 * Expand/Shrink the SVG according to wheel event
 * @param e WheelEvent object
 */
function svg_zoom(e: WheelEvent) {
  let zoom_rate = 1;
  e.preventDefault();
  console.log(e);
  let svg = document.querySelector("svg");
  if (svg) {
    if (e.deltaY < 0) {
      zoom_rate = 1.1;
    } else if (e.deltaY > 0) {
      zoom_rate = 0.9;
    }
    svg.style.height = svg_getStyleVal(svg, "height") * zoom_rate + "px";
    svg.style.width = svg_getStyleVal(svg, "width") * zoom_rate + "px";
    if (e.pageX && e.pageY) {
      svg.style.left =
        svg_getStyleVal(svg, "left") +
        (e.pageX - svg_getStyleVal(svg, "left")) * (1 - zoom_rate) +
        "px";
      svg.style.top =
        svg_getStyleVal(svg, "top") +
        (e.pageY - svg_getStyleVal(svg, "top")) * (1 - zoom_rate) +
        "px";
    }
  }
}

/**
 * Get value of style attribute as Number from SVG Element
 * @param elem SVG Element
 * @param cssAttr CSS Attribute
 * @returns value of attribute as Number
 */
function svg_getStyleVal(elem: SVGSVGElement, cssAttr: string) {
  let value = elem.style[cssAttr as keyof CSSStyleDeclaration];
  if (typeof value == "string") {
    return Number(value.replace("px", ""));
  } else return 0;
}
