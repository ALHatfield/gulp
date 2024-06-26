import autoprefixer from 'gulp-autoprefixer';
import bannerConfig from './banner.config.json' assert { type: 'json' };
import concat from 'gulp-concat';
import { deleteSync } from 'del';
import fs from "fs";
import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import gulp_remove_logging from 'gulp-remove-logging';
import handlebars from 'gulp-compile-handlebars';
import htmlmin from 'gulp-htmlmin';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import vinylPaths from "vinyl-paths";
const sass = gulpSass(dartSass) // need dart sass compiler to work

// handlebar options/helpers
let options = {
  batch : [`src/templates/partials`],
  helpers : {
    is: function(x, y, z) {
      if (x === y) return z.fn(this);
    },
    isnt: function(x, y, z) {
      if (x !== y) return z.fn(this);
    },
  }
}

// compile handlebars
function compileHBS(bannerData, done, production) {
  bannerData = { ...bannerData, production }

  gulp.src('src/templates/default.hbs')
    .pipe(handlebars(bannerData, options))
    .pipe(rename('index.html'))
    .pipe(htmlmin({
      collapseWhitespace: production,
      removeComments: production,
      removeEmptyAttributes: production,
      minifyCSS: production,
      minifyJS: production
    }))
    .pipe(gulp.dest(`build/${bannerData.size}`));

  done();
}

// compile sass
function compileSCSS({ size }, done) {
  let paths = [
    `src/scss/global.scss`,
    `src/scss/${size}.scss`
  ]

  gulp.src(paths)
    .pipe(concat('combined.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({ outputStyled: 'nested' }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(`build/${size}`));

  done();
}

// compile javascript
function compileJS({ size, isi }, done) {
  let paths = [
    `src/scripts/global.js`,
    `src/scripts/${size}.js`
  ]

  if (isi) {
    paths.push(`src/scripts/ISIScroller.js`)
  }

  gulp.src(paths)
    .pipe(concat('combined.js'))
    .pipe(gulp.dest(`build/${size}`));

  gulp.src(`src/utils/*.js`)
    .pipe(gulp.dest(`build/${size}`));

  done();
}

// compile images
function copyImages({ size }, done) {
  let paths = [
    `src/images/*.{jpg,jpeg,png,svg,mp4}`,
    `src/images/${size}/*.{jpg,jpeg,png,svg,mp4}`
  ]

  gulp.src(paths)
    .pipe(gulp.dest(`build/${size}`));

  done();
}

// package files for hand off
function packageFiles({ size }, done) {

  let expel = ["guide", "ISI_Expander", "PauseButton"];

  fs.readdir(`build/${size}/`, (err, files) => {
    for (const file of files) {
      expel.forEach(term => {
        if (file.toString().includes(term)) {
          deleteSync(`build/${size}/${file}`)
        }
      })
    }
  });

  gulp.src(`build/${size}/combined.css`)
    .pipe(vinylPaths(deleteSync))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`build/${size}`))

  gulp.src(`build/${size}/combined.js`)
    .pipe(vinylPaths(deleteSync))
    // .pipe(gulp_remove_logging())    // remove console log -not working
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`build/${size}`))

  done();
}

// Gulp tasks ////////////////////////////////////////////////////////////////////////////////////
gulp.task('package', (done) => {
  for (const banner of bannerConfig) {
    compileHBS(banner, done, true);
    packageFiles(banner, done);
  }
});

// loop and compile banner.config.json
gulp.task('compile', (done) => {
  for (const banner of bannerConfig) {
    compileHBS(banner, done, false);
    compileSCSS(banner, done);
    compileJS(banner, done);
    copyImages(banner, done);
  }
});

gulp.task('watch', () => {gulp.watch(`src/`, gulp.series(['clean', 'compile']))});
gulp.task('clean', async () => deleteSync([`build/*`]) );
gulp.task('default', gulp.series( 'clean', 'compile', 'watch' ));