import gulp from 'gulp';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import bannerConfig from './banner.config.json' assert { type: 'json' };


// HBS //////////////////////////////////////////////////////////////////////////////
import handlebars from 'gulp-compile-handlebars';
import htmlmin from 'gulp-htmlmin';
function compileHBS({ size, width, height }, done) {
  let data = {
    title: size,
    size: size,
    width: width,
    height: height,
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
      removeEmptyAttributes: false,   // development
      minifyCSS: false,
      minifyJS: false
    }))
    // .pipe(htmlmin({
    //   collapseWhitespace: true,
    //   removeComments: true,
    //   removeEmptyAttributes: true, // production
    //   minifyCSS: true,
    //   minifyJS: true
    // }))
    .pipe(gulp.dest(`build/${size}`));
  done();
}


// SASS //////////////////////////////////////////////////////////////////////////////
import autoprefixer from 'gulp-autoprefixer';
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass) // need dart sass compiler to work
function compileSCSS({ size }, done) {
  gulp.src([
    `src/styles/global.scss`,
    `src/styles/${size}.scss`
  ])
    .pipe(concat('combined.css'))
    .pipe(sass({outputStyled: 'nested'}))  // development
    // .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) // production
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(`build/${size}`));
  done();
}


// JS //////////////////////////////////////////////////////////////////////////////
import uglify from 'gulp-uglify';
function compileJS({ size }, done) {
  gulp.src([
    `src/scripts/global.js`,
    `src/scripts/${size}.js`
  ])
    .pipe(concat('combined.js'))
    // .pipe(uglify())      // production
    .pipe(gulp.dest(`build/${size}`));
  done();
}


// compile all //////////////////////////////////////////////////////////////////////////////
gulp.task('compile', (done) => {
  for (const banner of bannerConfig) {
    compileHBS(banner, done);
    compileSCSS(banner, done);
    compileJS(banner, done);
  }
})


////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', () => {gulp.watch(`src/`, gulp.series(['clean', 'compile']))})


import { deleteSync } from 'del';
gulp.task('clean', async () => deleteSync([`build/*`]) );


gulp.task('default', gulp.series(
  'clean',
  'compile',
  'watch',
));