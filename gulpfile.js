"use strict";

const siteCSS = 'weltpixel_custom/en_GB/css/style.css" />';
const rmScript = '/weltpixel_custom/en_GB/css/style.css">';
// const siteUrl = "https://www.mojohealth.net/";
// const siteCSS = '</body>';
// const siteUrl = "https://wholesale.mojohealth.net/";
const siteUrl = "https://www.mojohealth.net/";

const gulp = require("gulp");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const prefix = require("gulp-autoprefixer");
const sass = require("gulp-dart-sass");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync");
const cssnano = require("gulp-cssnano");

//css inject
gulp.task("css-inject", function () {
  var config = {
    addSourceMaps: true,
    concatCSS: true,
    plugins: {
      cleanCss: {}
    }
  };
  var reload = browserSync.reload;
  return (
    gulp
      .src("src/scss/common.scss")
      .pipe(
        plumber({
          errorHandler: notify.onError(function (err) {
            return {
              title: "Styles",
              message: err.message
            };
          })
        })
      )
      // .pipe(sourcemaps.init())
      .pipe(sass()) //Компиляция sass.
      .pipe(prefix("last 2 versions", "> 1%", "ie 9"))
      .pipe(rename("style.css"))
      .pipe(cssnano())
      .pipe(gulp.dest("app//"))
      .pipe(reload({ stream: true }))
  );
});

//watch
gulp.task("watch", function () {
  gulp.watch("src/scss/**/*.*", gulp.series("css"));
  gulp.watch("app/*.html", gulp.series("html"));
});

//build
gulp.task("build", function () {
  return gulp.src('./app/*.css')
    .pipe(gulp.dest('MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom/web//css'))
    .pipe(gulp.dest('MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_au/web//css'))
    .pipe(gulp.dest('MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_ca/web//css'))
    .pipe(gulp.dest('MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_eu/web//css'))
    .pipe(gulp.dest('MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_nz/web//css'))
    .pipe(gulp.dest('MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_us/web//css'));
});


//watch-inject
gulp.task("watch-inject", function () {
  gulp.watch("src/scss/**/*.*", gulp.series("css-inject"));
});

//server
gulp.task("server", function () {
  browserSync({
    proxy: siteUrl,
    middleware: require("serve-static")("./app"),
    rewriteRules: [
      {
        match: new RegExp(siteCSS),
        fn: function () {
          // return ("</body><link rel='stylesheet' id='inserted' href='" + siteUrl + "style.css'>");
          return ("\" /><link rel='stylesheet' id='inserted' href='" + siteUrl + "style.css'>");
          // return `
          // <link rel="stylesheet" type="text/css" media="all" href="https://mojohealth.net/pub/static/version1573119902/_cache/merged/feaaf5962c812f448bbf12af1d0fad85.min.css" />
          // <link rel="stylesheet" type="text/css" media="all" href="https://mojohealth.net/style.css" />
          // `;
        }
      },
      {
        match: new RegExp(rmScript),
        fn: function () {
          return ("\" />");
        }
      }
    ]
  });
});

gulp.task("inject", gulp.parallel("css-inject", "watch-inject", "server"));
gulp.task("default", gulp.parallel("css-inject", "watch-inject", "server"));

