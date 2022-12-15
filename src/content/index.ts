import $ from "jquery";

var grabbing = false;

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
var is_img =
  $("body").children().length == 1 && $("body").children()[0].matches("img");
var is_svg =
  $(document).children().length == 1 &&
  $(document).children()[0].matches("svg");

if (is_img) {
  $("head").append(
    `<style>
    body{
      margin:0;
      padding: 0;
      background-color: #0e0e0e !important;
      height:100%;
      font-family: "Roboto", sans-serif;
    }
    #t, #di{
      position: absolute;
      cursor: pointer;
      opacity: 0;
    }
    @keyframes hide-img{
      from{
        right: 0px;
        opacity: .5;
      }
      to{
        right: -50px;
        opacity: 0;
      }
    }
    .di-box{
      z-index: 101;
      position: fixed;
      top: 10px;
      right: 0;
      width: 140px;
      height: 140px;
      border-radius: 8px 0 0 8px;
      transition: .1s;
      animation: hide-img .2s forwards;
      overflow: hidden;
      cursor: pointer;
    }
    @keyframes show-img{
      from{
        right: -50px;
        opacity: 0;
      }
      to{
        right: 0px;
        opacity: .7;
      }
    }
    .di-box:hover{
      animation: show-img .2s forwards;
    }
    #di{
      border-radius: 8px 0 0 8px;
    }
    .status-bar{
      height:30px;
      display: flex;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      font-size:.8rem;
    } 
    .status{
      border-radius: 4px;
      padding: 4px 6px;
      margin-left: 4px;
      color: #ffffffcc;
      background: #0e0e0e88;
    }
    #st-magnification{
      cursor: pointer;
      user-select: none;
    }

    .tooltip{
      font-size: .8rem;
      padding: 8px;
      border-radius: 4px;
      background: #3e3e3ecc;
      color: #ffffffcc;
      position: absolute;
      display:none;
    }
    :hover + .tooltip{
      display:block;
    }
    .di-tooltip{
      top: 160px;
      right: 15px;
    }

    ::-webkit-scrollbar {
      width: 16px;
    }
    ::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 5px 5px #333333;
      border: solid 5px transparent;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:active {
      box-shadow: inset 0 0 10px 10px #686868;
    }
    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-corner {
      display: none;
    }
        </style>
  `
  );
  let src: string, init_img_detail: any, init_w: number, init_h: number;
  src = ($("body").children()[0] as HTMLSourceElement).src;
  init_img_detail = getDetails("img");
  console.log(init_img_detail);
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

  var original_w: number, original_h: number;

  $("#t, #draggable-image").on("load", () => {
    var di = $("#di");
    let t_detail = getDetails("#t");
    original_w = t_detail.w;
    original_h = t_detail.h;
    var screen_w = window.innerWidth;
    var screen_h = window.innerHeight;
    var img_aspect_ratio = original_w / original_h;
    var screen_aspect_ratio = screen_w / screen_h;

    $("#t").css({
      height: init_h,
      width: init_w,
      left: (screen_w - init_w) / 2,
      top: (screen_h - init_h) / 2,
    });
    console.log(getDetails("body"));
    console.log((screen_h - init_h) / 2);

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
    drawStatus("m");
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
    $("body").on("mouseup mouseleave", (e) => {
      e.preventDefault();
      grabbing = false;
    });
    $("body").on("mousemove", (e) => {
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
      let t = getDetails("#t");
      await $("#t").css({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      });
      let body = getDetails("body");
      $("#t").css({
        width: t.w,
        height: t.h,
        left: t.l,
        top: t.t,
      });
      let left_r = (t.l + t.w / 2) / screen_w;
      $("#t").css({
        left: body.w * left_r - t.w / 2,
      });
      screen_w = window.innerWidth;
      screen_h = window.innerHeight;
      screen_aspect_ratio = screen_w / screen_h;
    });

    document
      .querySelector("#t")
      ?.addEventListener("wheel", (e) => zoom(e as WheelEvent), {
        passive: false,
      });

    function fitHeight() {
      return [Math.floor(screen_h), screen_h * img_aspect_ratio];
    }
    function fitWidth() {
      return [screen_w / img_aspect_ratio, screen_w];
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
            h = screen_w > screen_h ? screen_h : screen_w;
            w = h;
          } else if (screen_aspect_ratio > img_aspect_ratio) {
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
          left: Number((screen_w - w) / 2),
          top: Number((screen_h - h) / 2),
        });
      }
      drawStatus("m");

      size_set_state = (size_set_state + 1) % 2;
    });
    $(document).on("keydown", (e) => {
      if (e.originalEvent?.code == "Escape") {
        window.close();
      }
    });
  });
} else if (is_svg) {
  // init_w = $("svg").height;
  // init_h = $("svg").width;
  // let svg_tag = $(document).children()[0];
  // url = "chrome-extension://ofdgcmhklipelkeicnjklcnmikbcanal/svg.html";
  // window.location.replace(url);
}

function zoom(e: WheelEvent) {
  $("#t").removeClass("zoom-init move-init");

  let h = $("#t").innerHeight();
  let w = $("#t").innerWidth();
  var zoom_rate = 1;
  let t = getDetails("#t");
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
  drawStatus("m");
  e.preventDefault();
}

function drawStatus(st: string) {
  switch (st) {
    case "m":
      $("#st-magnification").html(
        `${Math.round((($("#t").innerHeight() || 0) / original_h) * 100)}%`
      );
      break;
    default:
      break;
  }
}

function getDetails(selector: string) {
  return {
    h: document.querySelector(selector)?.getBoundingClientRect().height || 0,
    w: document.querySelector(selector)?.getBoundingClientRect().width || 0,
    t: $(selector).position().top || 0,
    l: $(selector).position().left || 0,
  };
}
