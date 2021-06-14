const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const minimist = require('minimist');
const { envOptions } = require('./envOptions');

// $gulp --env develop 預設
// $gulp --env production
const options = minimist(process.argv.slice(2), envOptions)
console.log(`目前模式是: ${options.env}`);

function copyFile() {
  return gulp.src(envOptions.copyFile.src)
    .pipe(gulp.dest(envOptions.copyFile.path))
    .pipe(browserSync.stream())
}

function layoutHTML() {
  return gulp.src(envOptions.html.src)
    .pipe($.plumber())
    .pipe($.frontMatter())
    .pipe(
      $.layout((file) => {
        return file.frontMatter;
      })
    )
    .pipe(gulp.dest(envOptions.html.path))
    .pipe(browserSync.stream())
}

function sass() {
  return gulp.src(envOptions.style.src)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass(
      {
        outputStyle: 'nested',
        includePaths: ['./node_modules/bootstrap/scss']
      }
    ).on('error', $.sass.logError))
    .pipe($.postcss([autoprefixer()]))
    .pipe($.if(options.env === 'production', $.cleanCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(envOptions.style.path))
    .pipe(browserSync.stream())
}

function babel() {
  return gulp.src(envOptions.javascript.src)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env']
    }))
    .pipe($.concat(envOptions.javascript.concat))
    .pipe($.if(options.env === 'production', $.uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(envOptions.javascript.path))
    .pipe(browserSync.stream())
}

function vendorJs() {
  return gulp.src(envOptions.vendors.src)
    .pipe($.concat(envOptions.vendors.concat))
    .pipe($.if(options.env === 'production', $.uglify()))
    .pipe(gulp.dest(envOptions.vendors.path))
}

function browser() {
  return browserSync.init({
    server: {
      baseDir: envOptions.browserDir,
      reloadDebounce: 2000
    }
  });
}

function imageMin() {
  return gulp.src(envOptions.images.src)
    .pipe($.if(options.env === 'production', $.imagemin()))
    .pipe(gulp.dest(envOptions.images.path))
}

function clean() {
  return gulp.src(envOptions.clean.src, { read: false, allowEmpty: true })
    .pipe($.clean())
}

function deploy() {
  return gulp.src(envOptions.deploySrc)
    .pipe($.ghPages());
}

function watch() {
  gulp.watch(envOptions.javascript.src, copyFile);
  gulp.watch(envOptions.html.src, layoutHTML);
  gulp.watch(envOptions.html.ejsSrc, layoutHTML);
  gulp.watch(envOptions.style.src, sass);
  gulp.watch(envOptions.javascript.src, babel);
}

exports.deploy = deploy;

exports.clean = clean;

// series() 依序執行，必須一個執行完才能執行下一個
// parallel() 平行執行，可同時多個任務

// $gulp build --env production
exports.build = gulp.series(clean, copyFile, layoutHTML, sass, babel, vendorJs, imageMin);

exports.default = gulp.series(clean, copyFile, layoutHTML, sass, babel, vendorJs, imageMin, gulp.parallel(browser, watch));