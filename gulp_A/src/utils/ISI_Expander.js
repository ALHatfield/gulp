/*jslint browser: true*/
/*global window */
/**  Created by aaron.cohen on 3/10/17 **/
let expanded = false;
let $container = document.getElementById("container");
// let bannerHeight = $container.offsetHeight;
// let bannerWidth = $container.offsetWidth;
let $ISI = document.getElementById("ISI") || false;
let $ISIWrapper = document.getElementById("ISIWrapper") || false;
let backgroundHolder_Height = document.getElementById("background-holder").offsetHeight;
let ISIWrapper_height = document.getElementById("ISIWrapper").scrollHeight || 0;
let PI_Height = document.getElementById("PI").offsetHeight || 0;

const expandISI = () => {
    "use strict";
    if (!expanded) {
        if (bannerWidth === 160 || bannerWidth === 300) {
            // vertical banner
            $container.style.height = backgroundHolder_Height + $ISIWrapper.scrollHeight + PI_Height + "px";
            $ISI.style.height = $ISIWrapper.scrollHeight + "px";
            $ISIWrapper.style.height = $ISIWrapper.scrollHeight + "px";
        } else {
            // horizontal banner
            $container.style.height = $ISIWrapper.scrollHeight + PI_Height + "px";
            $ISI.style.height = $ISIWrapper.scrollHeight + "px";
            $ISIWrapper.style.height = $ISIWrapper.scrollHeight + "px";
        }

        expanded = true;
    }
};


////////////////////////////////////////////////////////////////////////
// Pause / Play / ISIExpand functionality:
window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

const observer = new MutationObserver(function(mutation) {
    // pause/play
    if (parent.$iframe.attributes.pause) {
        let pause = parent.$iframe.attributes.pause.value;
        pause == "true" ? tl.pause() : tl.play();
    }
    // expander
    if (parent.$iframe.attributes.expand) {
        let expand = parent.$iframe.attributes.expand.value;
        expand === "true" ? expandISI() : null;
    }

});

observer.observe(parent.$iframe, {
    attributes: true // this is to watch for attribute changes.
});
// observer.disconnect();

