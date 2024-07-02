import fs from "fs";
// import fse, { copy } from "fs-extra";
import fse from "fs-extra";
// import input from "./input.json";
import input from "./input.json" assert { type: 'json' };


//////// output ////////////////////////////


// copy template folder contents into _banner folder
const srcDir = `./template`;
const destDir = `./_banner_`;
fse.copySync(srcDir, destDir, { overwrite: true|false }, err => {
    if (err) return console.error(err)
});


// Read through input.json and write HTML/CSS/JS content
let copyHTML = "";
let copyCSS = "";
let copyVariablesJS = "";
let copySelectorsJS = "";
let variablesJS = "";
let selectorsJS = "";
let timelineJS = "";
input.frames.map( (frame, index) => {
    index++ // starting count at '1'

    for (const copyID in frame) {
        copyHTML += `<div id="frame${copyID}" class="pos-abs hide">${frame[copyID]}</div>\n\t\t`;
        copyCSS +=
        `\n#frame${copyID} {\n` +
        `\tfont-size: 10px;\n` +
        `\tline-height: 12px;\n` +
        `\twidth: 100%;\n` +
        `\tpadding: 0 0;\n` +
        `\ttop: 0;\n` +
        `\tleft:\u00200;\n}`;
        // copyVariablesJS += `let $frame${copyID};\n`.replace('-', '_');
        // copySelectorsJS += `\t$frame${copyID} = doc.getElementById("frame${copyID}");\n`.replace('-', '_');
    }

    variablesJS +=
        `let $frame${index};\n` +
        `let $frame${index}_in;\n` +
        `let $frame${index}_out;\n`;
    selectorsJS +=
        `$frame${index} = doc.querySelectorAll(".frame${index}");\n\t` +
        `$frame${index}_in = doc.querySelectorAll(".frame${index}-in");\n\t` +
        `$frame${index}_out = doc.querySelectorAll(".frame${index}-out");\n\t`;

    if (index === 1) {
        timelineJS +=
            `tl.add("frame${index}", 0.0);\n\t\t` +
            `// in\n\t\t` +
            `tl.to($frame1, { duration: 0.5, opacity: 1 }, "frame${index}");\n\t\t` +
            `tl.to($frame1_in, { duration: 0.5, opacity: 1 }, "frame${index}");\n\n\n\n`;
    } else {
        timelineJS +=
            `\t\ttl.add("frame${index}", ${2.5 * (index - 1)});\n\t\t` +
            `// out\n\t\t` +
            `tl.to($frame${(index - 1)}, { duration: 0.5, opacity: 0 }, "frame${index}");\n\t\t` +
            `tl.to($frame${(index)}_out, { duration: 0.5, opacity: 0 }, "frame${index}");\n\t\t` +
            `// in\n\t\t` +
            `tl.to($frame${index}, { duration: 0.5, opacity: 1 }, "frame${index}");\n\t\t` +
            `tl.to($frame${index}_in, { duration: 0.5, opacity: 1 }, "frame${index}");\n\n\n\n`;
    }
});


// Write HTML for default.hbs
fs.readFile(`${srcDir}/src/templates/default.hbs`, 'utf8', (err, data) => {
    if (err) throw err;
    data = data.replace(/%%%% CopyHTML %%%%/g, copyHTML)
    fs.writeFileSync(`${destDir}/src/templates/default.hbs`, data, (err) => {
        if (err) throw err;
        console.log(`updated: ${destDir}/src/templates/default.hbs`)
    });
});


// Write global SCSS
let scssVariables = "";
fs.readFile(`${srcDir}/src/scss/global.scss`, 'utf8', (err, data) => {
    if (err) throw err;
    scssVariables += `$font-family: ${input.fontFamily};\n$primary-color: ${input.primaryColor};\n$secondary-color: ${input.secondaryColor};`;
    data = data.replace(/%%%% scssVariables %%%%/g, scssVariables)
    fs.writeFileSync(`${destDir}/src/scss/global.scss`, data, (err) => {
        if (err) throw err;
        console.log(`updated: ${destDir}/src/scss/global.scss`)
    });
});


// Write global javascript
fs.readFile(`${srcDir}/src/scripts/global.js`, 'utf8', (err, data) => {
    if (err) throw err;
    // selectorsJS = '\n\t' + selectorsJS + '//\n' + copySelectorsJS;
    // data = data.replace(/%%%% SelectorsJS %%%%/g, selectorsJS)
    // variablesJS = '\n' + variablesJS + '//\n' + copyVariablesJS;
    data = data.replace(/\/\/%%%% VariablesJS %%%%/g, variablesJS);
    data = data.replace(/\/\/%%%% TimelineJS %%%%/g, timelineJS)
    fs.writeFileSync(`${destDir}/src/scripts/global.js`, data, (err) => {
        if (err) throw err;
        console.log(`updated: ${destDir}/src/scripts/global.js`)
    });
});


// Write font family cdn script
fs.readFile(`${srcDir}/src/templates/partials/scripts.hbs`, 'utf8', (err, data) => {
    if (err) throw err;
    data = data.replace(/%%%% fontFamilyCDN %%%%/g, `${input.fontFamilyCDN}`)
    fs.writeFileSync(`${destDir}/src/templates/partials/scripts.hbs`, data, (err) => {
        if (err) throw err;
        console.log(`updated: ${destDir}src/templates/partials/scripts.hbs`)
    });
});


// Write basic .gitignore file
let gitignore = "node_modules";
fs.writeFileSync(`${destDir}/.gitignore`, gitignore, (err) => {
    if (err) throw err;
});

// generate folders and files for all individual sizes
let width;
let height;
let overrideSCSS;
let overrideJS = "";
let indexHBS;
let isiHeight = input.isi === true ? 100 : 0;
let isiWidth = input.isi === true ? 300 : 0;
let piHeight = input.pi === true ? 14 : 0;
let bannerconfig = []
let stageHTML = "";
input.sizes.map( size => {

    // size "160x600"
    width = Number(size.split("x")[0])  // 160 integer
    height = Number(size.split("x")[1]) // 600 integer

    // write banner.config.json content
    bannerconfig.push({
        size,
        width,
        height,
        isi: input.isi,
        pi: input.pi
    })


    // write root index.html file for stage
    stageHTML += `<a href="build/${size}/index.html" target="flash_iframe" data-width="${width}" data-height="${height}" data-title="${size}">${size}</a><br>\n\t`;


    // remove pi from small banners
    if (height === 50) piHeight = 0;

    // override.scss file content based on ISI placement (horizontal vs vertical)
    // if (size === "728x90" || size === "970x250" || size === "970x90" || size === "530x120" || size === "320x50" || size === "300x50") {
    if ( width > height ) {
        // isiHeight = height - piHeight;
        overrideSCSS = `$banner_height: ${height}px;\n$banner_width: ${width}px;\n$pi_height: ${piHeight}px;\n$isi_height: $banner_height - $pi_height;\n$isi_width: ${isiWidth};\n/////////////////////////////////////////////////////\n#container {\n\theight: $banner_height;\n\twidth: $banner_width;\n}\n#animate-section {\n\theight: $banner_height;\n\twidth: $banner_width - $isi_width;\n}\n/////////////////////////////////////////////////////${copyCSS}\n\n//%%%% ImageCSS %%%%\n\n\n\n\n\n/////////////////////////////////////////////////////\n#ISI {\n\tborder-left: 1px solid #9a9b9e;\n\tbottom: $pi_height;\n\theight: $isi_height;\n\tleft: unset;\n\tright: 0;\n\twidth: $isi_width;\n}\n\n#ISIWrapper {\n\theight: $isi_height;\n}\n#ISICopy {\n\tpadding-bottom: 20px;\n}\n\n#PI {\n\tborder-left: 1px solid #9a9b9e;\n\tbottom: 0px;\n\tleft: unset;\n\tright: 0;\n\twidth: $isi_width;\n\theight: $pi_height;\n\tfont-size: 9px;\n\ttext-align: center;\n\tpadding: 2px 0;\n}`
    } else {
        overrideSCSS = `$banner_height: ${height}px;\n$banner_width: ${width}px;\n$isi_height: ${isiHeight}px;\n$pi_height: ${piHeight}px;\n/////////////////////////////////////////////////////\n#container {\n\theight: $banner_height;\n\twidth: $banner_width;\n}\n#animate-section {\n\theight: $banner_height - $isi_height - $pi_height;\n\twidth: $banner_width;\n}\n/////////////////////////////////////////////////////${copyCSS}\n\n//%%%% ImageCSS %%%%\n\n\n\n\n\n/////////////////////////////////////////////////////\n#ISI {\n\tborder-top: 1px solid #9a9b9e;\n\tbottom: $pi_height;\n\theight: $isi_height;\n\twidth: $banner_width;\n}\n\n#ISIWrapper {\n\theight: $isi_height;\n}\n\n#ISICopy {\n\tpadding-bottom: 20px;\n}\n\n#PI {\n\tbottom: 0px;\n\tleft: 0;\n\twidth: $banner_width;\n\theight: $pi_height;\n\tfont-size: 9px;\n\ttext-align: center;\n\tpadding: 2px 0;\n}`
    }


    // view/index.hbs file content
    indexHBS = `---\nsize: ${size}\nwidth: ${width}\nheight: ${height}\n---`


    // Write image directories
    fs.mkdirSync(`${destDir}/src/images/${size}`, { recursive: true }, (err) => {
        if (err) throw err;
        console.log(`created: ${destDir}/src/images/${size}`)
    });



    // Write files
    fs.writeFileSync(`${destDir}/src/scripts/${size}.js`, overrideJS, (err) => {
        if (err) throw err;
        console.log(`created: ${destDir}/src/scripts/${size}.js`)
    });

    fs.writeFileSync(`${destDir}/src/scss/${size}.scss`, overrideSCSS, (err) => {
        if (err) console.error(err)
        console.log(`created: ${destDir}/src/scss/${size}.scss`)
    });


});

// Write banner.config.json file
fs.writeFileSync(`${destDir}/banner.config.json`, JSON.stringify(bannerconfig, null, 2), (err) => {
    if (err) throw err;
    console.log(`updated: ${destDir}/banner.config.json`)
})

// Write root index.html file
fs.readFile(`${srcDir}/index.html`, 'utf8', (err, data) => {
    if (err) throw err;
    data = data.replace(/%%%% STAGE_HTML %%%%/g, stageHTML)
    fs.writeFileSync(`${destDir}/index.html`, data, (err) => {
        if (err) throw err;
        console.log(`updated: ${destDir}/index.html`)
    });
});






