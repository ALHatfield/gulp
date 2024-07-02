import fs from 'fs';               // write files
import path from 'path';           // reading file extension
import sizeOf from 'image-size';   // reading image sizes
import glob from 'glob';           // reading multiple wildcard directories
// import input from "./input.json" assert { type: 'json' };

const destDir = `./_banner_`;
// read image files and data
glob(`${destDir}/src/images/**/*`, function (err, files) {
    if (err) throw err;

    // collect image data
    let fileData = {};

    // iterate through files and get image data
    files.map((file) => {
        let ext = path.extname(file);
        if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".svg") {
            let folder = file.split('/').reverse()[1];
            let fileName = file.split('/').reverse()[0];
            let idName = fileName.split('.').slice(0, -1).join('.');
            let variableName = fileName.split('.').slice(0, -1).join('.').replace(/-/g,'_');
            let width = sizeOf(file).width;
            let height = sizeOf(file).height;
            let guideImageRegex = new RegExp("^\\bg[0-9]?$|^\\bguide[0-9]?$");  // g1.png  guide1.png

            // exclude guide images
            if (!guideImageRegex.test(idName)) {
                // organize file data into each folder size
                if (fileData.hasOwnProperty(folder)) {
                    fileData[folder].push({ file, folder, fileName, idName, variableName, width, height, ext });
                } else {
                    fileData[folder] = [];
                    fileData[folder].push({ file, folder, fileName, idName, variableName, width, height, ext });
                }
            }
        }
    });

    // check if image files were collected
    if (Object.keys(fileData).length === 0) {
        console.error("\x1b[31m", "\nimage.js: No Images Found\n", "\x1b[37m");
        return;
    }


    // handoff file data to write code
    writeCode(fileData);

});


// take image data and create code
function writeCode(fileData) {
    let imageHTML = "";
    let imageCSS = "";
    let imageVariables = "";
    let imageSelectors = "";
    let css = {};
    let bulk;

    // write css files and create bulk list of elements
    for (const size in fileData) {
        // bulk: concat a list of image files for every size without duplicates to write HTML and JS
        bulk = [...new Set(fileData[size])];

        // collect css organized by size
        css[fileData[size]] = ""
        fileData[size].forEach( ({ file, folder, fileName, idName, variableName, width, height, ext }) => {
            css[fileData[size]] +=
                `#frame${idName} { \n` +
                `\twidth: ${width/2}px;\t\t// half size\n` +
                `\theight: ${height/2}px;\t\t// half size\n` +
                `\twidth: ${width}px;\t\t// full size\n` +
                `\theight: ${height}px;\t\t// full size\n` +
                `\tbackground-image: url(${fileName});\n` +
                `\tbackground-repeat: no-repeat;\n` +
                `\tbackground-size: contain;\n` +
                `\ttop: 0;\n` +
                `\tleft: 0;\n}\n`
        });

        // write css file for each size
        writeCSS(size, css[fileData[size]])
    }


    // use bulk to build html and js code
    bulk.forEach( ({ file, folder, fileName, idName, variableName, width, height, ext }) => {
        imageHTML += `<div id="frame${idName}" class="pos-abs hide"></div>\n\t\t`
        // imageVariables += `let $frame${variableName};\n`
        // imageSelectors += `$frame${variableName} = doc.getElementById("frame${idName}");\n\t`
    });

    // write html file
    writeHTML(imageHTML)

    // write js file
    // writeJS(imageVariables, imageSelectors)      // no longer needed

}

function writeHTML(html) {
    fs.readFile(`${destDir}/src/templates/default.hbs`, 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace(/%%%% ImageHTML %%%%/g, html)
        fs.writeFileSync(`${destDir}/src/templates/default.hbs`, data, (err) => {
            if (err) throw err;
            console.log(`updated: src/templates/default.hbs`);
        });
    });
}

async function writeCSS(size, css){
    await fs.readFile(`${destDir}/src/scss/${size}.scss`, 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace(/\/\/%%%% ImageCSS %%%%/g, css)
        fs.writeFileSync(`${destDir}/src/scss/${size}.scss`, data, (err) => {
            if (err) throw err;
            console.log(`updated: src/scss/${size}.scss`);
        });
    });
}

// function writeJS(variables, selectors) {
//     fs.readFile(`${destDir}/src/global/scripts/global.js`, 'utf8', (err, data) => {
//         if (err) throw err;
//         data = data.replace(/\/\/%%%% ImageVariables %%%%/g, variables)
//         data = data.replace(/\/\/%%%% ImageSelectors %%%%/g, selectors)
//         fs.writeFileSync(`${destDir}/src/scripts/global.js`, data, (err) => {
//             if (err) throw err;
//             console.log(`updated: src/scripts/global.js`);
//         });
//     });
// }




