const doc = document;
const win = window;
//
var bannerWidth;
var bannerHeight;
let $isi;
let $pi;
let $animateSection;
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
let $frame1_out;
let $frame2;
let $frame2_in;
let $frame2_out;
let $frame3;
let $frame3_in;
let $frame3_out;
//



//
let animate = function () {
  "use strict";
  tl.add(() => { start_time = performance.now()/1000 }, "frame1");

  tl.add("frame1", 0.0);
  // in
  tl.to($frame1, {delay: 0, duration: 0.5, opacity: 1}, "frame1");
  tl.to($frame1_in, {delay: 0, duration: 0.5, opacity: 1}, "frame1");



  tl.add("frame2", 2.5);
  // out
  tl.to($frame1, {delay: 0, duration: 0.5, opacity: 0}, "frame2");
  tl.to($frame2_out, {delay: 0, duration: 0.5, opacity: 0}, "frame2");
  tl.to($frame1_logo, {delay: 0, duration: 0.5, scale: 0.7, x: -86, y: -5 }, "frame2-=0.5");
  // in
  tl.to($frame2, {delay: 0, duration: 0.5, opacity: 1}, "frame2");
  tl.to($frame2_in, {delay: 0, duration: 0.5, opacity: 1}, "frame2");



  tl.add("frame3", 7.0);
  // out
  tl.to($frame2, {delay: 0, duration: 0.5, opacity: 0}, "frame3");
  tl.to($frame3_out, {delay: 0, duration: 0.5, opacity: 0}, "frame3");
  // in
  tl.to($frame3, {delay: 0, duration: 0.5, opacity: 1}, "frame3");
  tl.to($frame3_in, {delay: 0, duration: 0.5, opacity: 1}, "frame3");






  tl.call(function () {
    startISIScroll()
    console.log(performance.now()/1000 - start_time)
  });
}

// Function for initiating automatic ISI scroll
let startISIScroll = () => {
  if(window.ISIScroller) {
    ISIScroller = new window.ISIScroller(true);
    ISIScroller.start();
  }
}
// Function to control the click on the PI link
let exitHandler3 = (e) =>  {
  "use strict";
  e.preventDefault();
  e.stopPropagation();
  window.open(window.clickTag3);
  Enabler.exit("clickTag3");
}
// Function to control the click on the PI link
let exitHandler2 = (e) =>  {
  "use strict";
  e.preventDefault();
  e.stopPropagation();
  window.open(window.clickTag2);
  Enabler.exit("clickTag2");
}
// Function to control the click on the click on the banner
let exitHandler1 = (e) =>  {
  "use strict";
  e.preventDefault();
  e.stopPropagation();
  window.open(window.clickTag1);
  Enabler.exit("clickTag1");
}

function enablerInitHandler() {
  "use strict";
  $clickTag1 = doc.querySelectorAll(".clickTag1");
  $clickTag1.forEach(function (elem) {
    elem.addEventListener("click", exitHandler1, false);
  });
  $clickTag2 = doc.querySelectorAll(".clickTag2");
  $clickTag2.forEach(function (elem) {
    elem.addEventListener("click", exitHandler2, false);
  });
  $clickTag3 = doc.querySelectorAll(".clickTag3");
  $clickTag3.forEach(function (elem) {
    elem.addEventListener("click", exitHandler3, false);
  });
  //
  $isi = doc.getElementById("ISI");
  $pi = doc.getElementById("PI");
  $animateSection = doc.getElementById("animate-section");
  bannerWidth = doc.getElementById("container").offsetWidth;
  bannerHeight = doc.getElementById("container").offsetHeight;
  //
  $frame1 = doc.querySelectorAll(".frame1");
  $frame1_in = doc.querySelectorAll(".frame1-in");
  $frame1_out = doc.querySelectorAll(".frame1-out");
  $frame2 = doc.querySelectorAll(".frame2");
  $frame2_in = doc.querySelectorAll(".frame2-in");
  $frame2_out = doc.querySelectorAll(".frame2-out");
  $frame3 = doc.querySelectorAll(".frame3");
  $frame3_in = doc.querySelectorAll(".frame3-in");
  $frame3_out = doc.querySelectorAll(".frame3-out");
  //

  let regex = new RegExp("-", "g");
  for (const elem of $animateSection.children) {
    if (elem.id) {
      let elem_variable = `$${elem.id.replace(regex, '_')}`;
      win[elem_variable] = doc.getElementById(`${elem.id}`);
    }
  }


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