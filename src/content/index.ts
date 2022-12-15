import $ from "jquery";
import { svg_main } from "./svg";
import { img_main } from "./img";

$(() => {
  if (
    $("body").children().length == 1 &&
    $("body").children()[0].matches("img")
  ) {
    img_main();
  } else if (
    $(document).children().length == 1 &&
    $(document).children()[0].matches("svg")
  ) {
    svg_main();
  }
});
