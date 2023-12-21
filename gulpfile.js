import gulp from 'gulp';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import fs from 'fs'

const src = './src'
const dest = './build'


// HBS //////////////////////////////////////////////////////////////////////////////
import handlebars from 'gulp-compile-handlebars';
import htmlmin from 'gulp-htmlmin';

function compileHBS(done) {
  let data = {
    title: banner.size,
    size: banner.size,
    width: banner.width,
    height: banner.height,
    option: 1,
    production: false
  }
  let options = {
    batch : [`src/templates/partials`],
    helpers : {
      contains: function(x, y, z) {
        if (x === y) return z.fn(this);
      },
      is: function(x, y, z) {
        if (x === y) return z.fn(this);
      }
    }
  }
  gulp.src('src/templates/layouts/default.hbs')
    .pipe(handlebars(data, options))
    .pipe(rename('index.html'))
    .pipe(htmlmin({
      collapseWhitespace: false,
      removeComments: false,
      removeEmptyAttributes: false,
      minifyCSS: false,
      minifyJS: false
    }))
    // .pipe(htmlmin({
    //   collapseWhitespace: true,
    //   removeComments: true,
    //   removeEmptyAttributes: true,
    //   minifyCSS: true,
    //   minifyJS: true
    // }))
    .pipe(gulp.dest(`build/${banner.size}`));
  done();
}

// SASS //////////////////////////////////////////////////////////////////////////////
import * as dartSass from 'sass' // doesn't work even though it's suggested
// import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass) // need dart sass compiler to work
// const Sass = gulpSass(sass) // need dart sass compiler to work


import autoprefixer from 'gulp-autoprefixer';

function compileSCSS(done) {
  gulp.src([
    `src/styles/global.scss`,
    `src/styles/${banner.size}.scss`
  ])
    .pipe(concat('combined.css'))
    // .pipe(sass({outputStyled: 'nested'}))  // development
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) // production
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(`build/${banner.size}`));
  done();
}


// JS //////////////////////////////////////////////////////////////////////////////
import uglify from 'gulp-uglify';

function compileJS(done) {
  gulp.src([
    `src/scripts/global.js`,
    `src/scripts/${banner.size}.js`
  ])
    .pipe(concat('combined.js'))
    .pipe(uglify())
    .pipe(gulp.dest(`build/${banner.size}`));
  done();
}

// compile all //////////////////////////////////////////////////////////////////////////////
import banners from './banner.config.json' assert { type: 'json' };
let banner = {};

gulp.task('compileAll', async (done) => {
  for (let i = 0; i < banners.length; i++ ) {
    banner = banners[i];

    compileHBS(done)
    compileSCSS(done);
    compileJS(done);
  }
})






////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', () => {gulp.watch(src, gulp.series(['clean', 'compileAll']))})
// gulp.task('build', gulp.parallel(['taskHBS', 'taskCSS', 'taskJS']))


import { deleteSync } from 'del';
gulp.task('clean', async () => deleteSync([`build/*`]) );


gulp.task('default', gulp.series(
  'clean',
  'compileAll',
  'watch',
));