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


// compile handlebars
function compileHBS({ size, width, height }, path, done) {
  let data = { size, width, height }
  let options = {
    batch : [`${path.src}/templates/partials`],
    helpers : {
      contains: function(x, y, z) {
        if (x === y) return z.fn(this);
      },
      is: function(x, y, z) {
        if (x === y) return z.fn(this);
      }
    }
  }

  gulp.src(`${path.src}/templates/layouts/default.hbs`)
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
    .pipe(gulp.dest(path.build));
  done();
}

// compile sass
function compileSCSS({ size }, path, done) {
  gulp.src([
    `${path.src}/styles/global.scss`,
    `${path.src}/styles/${size}.scss`
  ])
    .pipe(concat('combined.css'))
    .pipe(sass({outputStyled: 'nested'}))  // development
    // .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) // production
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(path.build));
  done();
}

// compile javascript
function compileJS({ size }, path, done) {
  gulp.src([
    `${path.src}/scripts/global.js`,
    `${path.src}/scripts/${size}.js`
  ])
    .pipe(concat('combined.js'))
    // .pipe(uglify())                        // production
    .pipe(gulp.dest(path.build));
  done();
}



// loop and compile banner.config.json
async function configureBuildPath(bannerConfig, set, { size }) {
  if (Object.keys(bannerConfig).length === 1) {
    return {
      "build": `build/${size}`,
      "src": `src/`
    }
  } else {
    return {
      "build": `build/${set}/${size}`,
      "src": `src/${set}/`
    }
  }
}


gulp.task('compile', async (done) => {
  for (const bannerSet in bannerConfig) {
    for (const banner of bannerConfig[bannerSet]) {
      let path = await configureBuildPath(bannerConfig, bannerSet, banner);
      compileHBS(banner, path, done);
      compileSCSS(banner, path, done);
      compileJS(banner, path, done);
    }
  }
})


////////////////////////////////////////////////////////////

gulp.task('clean', async () => deleteSync([`build/*`]) );
gulp.task('watch', () => {gulp.watch(`src/`, gulp.series(['clean', 'compile']))})
gulp.task('default', gulp.series( 'clean', 'compile', 'watch' ));