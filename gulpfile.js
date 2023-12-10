import gulp from 'gulp';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import fs from 'fs'
const src = './src/'
const build = './build/'


////////////////////////////////////////////////////////////////////////////////
import { deleteSync } from 'del';
gulp.task('clean', async () => {
  // You can use multiple globbing patterns as you would with `gulp.src`
  await deleteSync([`${build}/*`]);
});
////////////////////////////////////////////////////////////////////////////////
import handlebars from 'gulp-compile-handlebars';
// console.log(handlebars)
// console.log(handlebars.Handlebars.helpers)
gulp.task('taskHBS', () => {
  let data = {
    title: '160x600',
    size: '160x600',
    option: 1,
    production: false
  }
  let options = {
    // partials: './src/templates/partials/*.hbs',
    batch : ['./src/templates/partials'],
    helpers : {
      contains: function(x, y, z) {
        if (x === y) return z.fn(this);
      },
      is: function(x, y, z) {
        if (x === y) return z.fn(this);
      }
    }
  }
  return gulp.src('src/templates/layouts/default.hbs')
    // .pipe(handlebars(templateData, options))
    .pipe(handlebars(data, options))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('build'));
});






////////////////////////////////////////////////////////////////////////////////
// const sass = require('gulp-sass')(require('sass'));
// import * as sass from 'sass' // doesn't work even though it's suggested
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass) // need dart sass compiler to work

import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';

gulp.task('taskCSS', () => {
  return gulp.src([
    './src/global/styles/*.scss',
    './src/styles/*.scss'
  ])
  .pipe(concat('combined.css'))
  .pipe(sass({outputStyled: 'nested'}))
  .pipe(autoprefixer('last 2 versions'))
  .pipe(cleanCSS())
  // .pipe(rename('combined.css'))
  .pipe(gulp.dest(build))
})
////////////////////////////////////////////////////////////////////////////////
import uglify from 'gulp-uglify';
import { type } from 'os';

gulp.task('taskJS', () => {
  return gulp.src('./src/scripts/global.js')
    .pipe(concat('combined.js'))
    .pipe(uglify())
    .pipe(gulp.dest(build))
})


////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', () => {
  gulp.watch(src, gulp.series([
    'clean',
    gulp.parallel(['taskHBS', 'taskCSS', 'taskJS'])
  ]))
  // gulp.watch(src, gulp.series(['taskCSS']))
  // gulp.watch('./src/templates', gulp.series('taskHBS'))
  // gulp.watch('./src/styles/*.scss', gulp.series('taskCSS'))
  // gulp.watch('./src/scripts/*.js', gulp.series('taskJS'))
})

////////////////////////////////////////////////////////////////////////////////
// ??? not working
gulp.task('build', async () => {
  await gulp.parallel(['taskHBS', 'taskCSS', 'taskJS'])
})

////////////////////////////////////////////////////////////////////////////////


// gulp.task('default', gulp.series('build', 'watch'));
// gulp.task('default', gulp.series('clean', 'build', 'watch'));
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel(['taskHBS', 'taskCSS', 'taskJS']),  // 'build',
  // 'build',
  'watch',
));