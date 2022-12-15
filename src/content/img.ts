import { getScreenSize } from "./common";
import IMG_STYLE from "./img_style";
import $ from "jquery";

export function img_main() {
  let grabbing = false;
  let screen = getScreenSize();
  let original_h: number, original_w: number;
  var pos = {
    cursor: {
      x: 0,
      y: 0,
    },
    img: {
      top: 0,
      left: 0,
    },
  };
  $("head").append(IMG_STYLE);
  let src: string, init_img_detail: any, init_w: number, init_h: number;
  src = ($("body").children()[0] as HTMLSourceElement).src;
  init_img_detail = img_getDetails("img");
  init_w = init_img_detail.w;
  init_h = init_img_detail.h;

  $("body").append(`
  <img src="${src}" id="t" />
  <div class="di-box">
    <img src="${src}" id="di" class="init"/>
    </div>
  <div class="tooltip di-tooltip">Draggable image</div>
  <div class="status-bar">
    <span id="st-size" class="status"></span>
    <span id="st-magnification" class="status"></span>
  </div>
  `);

  $("#t, #draggable-image").on("load", () => {
    var di = $("#di");
    let t_detail = img_getDetails("#t");
    original_w = t_detail.w;
    original_h = t_detail.h;
    var img_aspect_ratio = original_w / original_h;

    $("#t").css({
      height: init_h,
      width: init_w,
      left: (screen.w - init_w) / 2,
      top: (screen.h - init_h) / 2,
    });
    console.log(img_getDetails("body"));
    console.log((screen.h - init_h) / 2);

    $("#di").css({
      width: img_aspect_ratio > 1 ? "auto" : 140,
      height: img_aspect_ratio < 1 ? "auto" : 140,
    });

    // first draw
    $("img")[0].remove();
    $("#t, #info-box").css("opacity", 1);
    setTimeout(() => {
      $("#di").css("opacity", 1);
    }, 500);

    // draw status
    img_drawMagRate();
    $("#st-size").html(`${original_w} x ${original_h}`);

    di.css({
      top: -1000,
    });
    di.show();
    setTimeout(() => {
      di.css({
        top: 10,
      });
    }, 300);

    pos.img.top = $("#t").position().top;
    pos.img.left = $("#t").position().left;

    $("#t").on("mousedown", (e) => {
      pos.cursor.x = e.originalEvent?.pageX || 0;
      pos.cursor.y = e.originalEvent?.pageY || 0;
      pos.img.top = $("#t").position().top;
      pos.img.left = $("#t").position().left;
      e.preventDefault();
      grabbing = true;
    });
    $(window).on("mouseup", (e) => {
      e.preventDefault();
      grabbing = false;
    });
    $(window).on("mousemove", (e) => {
      if (grabbing) {
        $("#t").removeClass("move-init");
        let current_x = e.originalEvent?.pageX || 0;
        let current_y = e.originalEvent?.pageY || 0;
        $("#t").css({
          left: pos.img.left + (current_x - pos.cursor.x),
          top: pos.img.top + (current_y - pos.cursor.y),
        });
      }
    });

    $(window).on("resize", async () => {
      let t = img_getDetails("#t");
      await $("#t").css({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      });
      let body = img_getDetails("body");
      $("#t").css({
        width: t.w,
        height: t.h,
        left: t.l,
        top: t.t,
      });
      let left_r = (t.l + t.w / 2) / screen.w;
      $("#t").css({
        left: body.w * left_r - t.w / 2,
      });
      screen = getScreenSize();
    });

    document
      .querySelector("#t")
      ?.addEventListener("wheel", (e) => img_zoom(e as WheelEvent), {
        passive: false,
      });

    function fitHeight() {
      return [Math.floor(screen.h), screen.h * img_aspect_ratio];
    }
    function fitWidth() {
      return [screen.w / img_aspect_ratio, screen.h];
    }
    var size_set_state = 0;
    $("#st-magnification").on("click", () => {
      let w, h;
      switch (size_set_state) {
        case 0:
          w = original_w;
          h = original_h;
          break;
        case 1:
          if (img_aspect_ratio == 1) {
            h = screen.w > screen.h ? screen.h : screen.w;
            w = h;
          } else if (screen.aspectRatio > img_aspect_ratio) {
            [h, w] = fitHeight();
          } else {
            [h, w] = fitWidth();
          }
          break;
        default:
          break;
      }
      if (w !== undefined && h !== undefined) {
        $("#t")?.css({
          width: Number(w),
          height: Number(h),
          left: Number((screen.w - w) / 2),
          top: Number((screen.h - h) / 2),
        });
      }
      img_drawMagRate();

      size_set_state = (size_set_state + 1) % 2;
    });
    $(document).on("keydown", (e) => {
      if (e.originalEvent?.code == "Escape") {
        window.close();
      }
    });
  });
  /**
   * Expand/Shrink the image according to wheel event
   * @param e Wheel Event
   */
  function img_zoom(e: WheelEvent) {
    $("#t").removeClass("zoom-init move-init");

    let h = $("#t").innerHeight();
    let w = $("#t").innerWidth();
    var zoom_rate = 1;
    let t = img_getDetails("#t");
    if (e.deltaY < 0 && t.h < 500000 && t.w < 500000) {
      var zoom_rate = 1.1;
    } else if (e.deltaY > 0 && (t.h > 20 || t.w > 20)) {
      zoom_rate = 0.9;
    }
    $("#t").css({
      height: t.h * zoom_rate,
      width: t.w * zoom_rate,
      left: t.l + (e.clientX - t.l) * (1 - zoom_rate),
      top: t.t + (e.clientY - t.t) * (1 - zoom_rate),
    });
    img_drawMagRate();
    e.preventDefault();
  }

  /**
   * Get value of height, width, top and left of an element
   * @param selector Element selector
   * @returns height, width, top, left
   */
  function img_getDetails(selector: string) {
    return {
      h: document.querySelector(selector)?.getBoundingClientRect().height || 0,
      w: document.querySelector(selector)?.getBoundingClientRect().width || 0,
      t: $(selector).position().top || 0,
      l: $(selector).position().left || 0,
    };
  }

  /**
   * Update value of Rate Of Magnification
   */
  function img_drawMagRate() {
    let img = document.querySelector("#t") as HTMLImageElement;
    $("#st-magnification").html(
      `${Math.round(((img.clientHeight || 0) / img.naturalHeight) * 100)}%`
    );
  }
}
