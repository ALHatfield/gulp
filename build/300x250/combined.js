//
console.log('global.js')
const doc = document;
const win = window;




//
var ISIScroller;
// var bannerWidth;
// var bannerHeight;
let $isi;
let $pi;
let $backgroundHolder;
//
let $clickTag1;
let $clickTag2;
let $clickTag3;
//
let tl;
let start_time;
//
let $frame1;
let $frame1_in;
let $frame2;
let $frame3;
let $frame4;

//
// let $frame1_copy;
// let $frame1_cover;
// let $frame1_logoKO;
// let $frame2_logo;



//
let animate = function () {
  "use strict";
  tl.add(() => { start_time = performance.now()/1000 }, "frame1");

  tl.add("frame1", 0.0);
  // in
  tl.to($frame1, {delay: 0, duration: 0.5, opacity: 1}, "frame1");
  tl.to($frame1_in, {delay: 0, duration: 0.5, opacity: 1}, "frame1");

  tl.to($frame1_cover, {delay: 0, duration: 0.5, y: -250 }, "frame1+=2.0");
  tl.to($frame1_copy, {delay: 0, duration: 0.5, color: "#48326F" }, "frame1+=2.0");
  tl.to($frame1_logoKO, {delay: 0, duration: 0.5, opacity: 0 }, "frame1+=2.0");
  tl.to($frame2_logo, {delay: 0, duration: 0.5, opacity: 1 }, "frame1+=2.0");


  tl.add("frame2", 5.0);
  // out
  tl.to($frame1, {delay: 0, duration: 0.5, opacity: 0}, "frame2");

  // in
  tl.to($frame2, {delay: 0, duration: 0.5, opacity: 1}, "frame2");



  tl.add("frame3", 8.5);
  // out
  tl.to($frame2, {delay: 0, duration: 0.5, opacity: 0}, "frame3");
  // in
  tl.to($frame3, {delay: 0, duration: 0.5, opacity: 1}, "frame3");



  tl.add("frame4", 12.5);
  // out
  tl.to($frame3, {delay: 0, duration: 0.5, opacity: 0}, "frame4");
  // in
  tl.to($frame4, {delay: 0, duration: 0.5, opacity: 1}, "frame4");





  tl.call(() => {
    console.log(performance.now()/1000 - start_time)
  });
}




// Function to control the click on the click on the banner
let exitHandler1 = (e) =>  {
  "use strict";
  e.preventDefault();
  e.stopPropagation();
  win.open(win.clickTag1);
  Enabler.exit("clickTag1");
}

function enablerInitHandler() {
  "use strict";
  $clickTag1 = doc.querySelectorAll(".clickTag1");
  $clickTag1.forEach(function (elem) {
    elem.addEventListener("click", exitHandler1, false);
  });

  //
  $frame1 = doc.querySelectorAll(".frame1");
  $frame1_in = doc.querySelectorAll(".frame1-in");
  $frame2 = doc.querySelectorAll(".frame2");
  $frame3 = doc.querySelectorAll(".frame3");
  $frame4 = doc.querySelectorAll(".frame4");
  //

  $backgroundHolder = doc.getElementById("background-holder");

  let frameList = [];

  for (const elem of $backgroundHolder.children) {
    if (elem.id) {
      let elem_variable = `$${elem.id.replace('-', '_')}`;
      win[elem_variable] = doc.getElementById(`${elem.id}`);
    }
  }


  //

  //
  tl = gsap.timeline();
  //


  //
  animate();
}

let init = () => {
  "use strict";
  if (Enabler.isInitialized()) {
    enablerInitHandler();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
  }
};

init();