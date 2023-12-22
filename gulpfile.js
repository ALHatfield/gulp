import autoprefixer from 'gulp-autoprefixer';
import bannerConfig from './banner.config.json' assert { type: 'json' };
import concat from 'gulp-concat';
import { deleteSync } from 'del';
import gulp from 'gulp';
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import handlebars from 'gulp-compile-handlebars';
import htmlmin from 'gulp-htmlmin';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
const sass = gulpSass(dartSass) // need dart sass compiler to work

// handlebar options/helpers
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

// compile handlebars
function compileHBS({ size, width, height, set }, buildPath, done) {
  let data = { size, width, height, set, production: false }

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
    .pipe(gulp.dest(buildPath));
  done();
}

// compile sass
function compileSCSS({ size }, buildPath, done) {
  gulp.src([
    `src/styles/global.scss`,
    `src/styles/${size}.scss`
  ])
    .pipe(concat('combined.css'))
    .pipe(sass({outputStyled: 'nested'}))  // development
    // .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) // production
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(buildPath));
  done();
}

// compile javascript
function compileJS({ set, size }, buildPath, done) {
  set ? set : set = ".";
  gulp.src([
    `${set}/src/scripts/global.js`,
    `${set}/src/scripts/${size}.js`
  ])
    .pipe(concat('combined.js'))
    // .pipe(uglify())                        // production
    .pipe(gulp.dest(buildPath));
  done();
}



// loop and compile banner.config.json
// banner.config.json //////////////////////////////////////////////////////////
function configureBuildPath({ set, size }) {
  if (set) {
    return `build/${set}/${size}`
  } else {
    return `build/${size}`
  }
}
gulp.task('compile', async (done) => {
  for (const banner of bannerConfig) {
    let buildPath = await configureBuildPath(banner)
    compileHBS(banner, buildPath, done);
    compileSCSS(banner, buildPath, done);
    compileJS(banner, buildPath, done);
  }
})
////////////////////////////////////////////////////////////

gulp.task('clean', async () => deleteSync([`build/*`]) );
gulp.task('watch', () => {gulp.watch(`src/`, gulp.series(['clean', 'compile']))})
gulp.task('default', gulp.series( 'clean', 'compile', 'watch' ));