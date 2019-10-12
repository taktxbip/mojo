"use strict";

var siteCSS =
    "https://mojohealth.net/pub/static/frontend/Pearl/weltpixel_custom/en_GB/css/style.css",
  siteUrl = "https://mojohealth.net/";

var gulp = require("gulp"),
  rename = require("gulp-rename"),
  notify = require("gulp-notify"),
  prefix = require("gulp-autoprefixer"),
  sass = require("gulp-sass"),
  plumber = require("gulp-plumber"),
  browserSync = require("browser-sync"),
  cssnano = require("gulp-cssnano");

//css inject
gulp.task("css-inject", function() {
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
          // plumber - плагин для отловли ошибок.
          errorHandler: notify.onError(function(err) {
            // nofity - представление ошибок в удобном для вас виде.
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
      // .pipe(sourcemaps.write())
      .pipe(cssnano())
      .pipe(gulp.dest("app//"))
      .pipe(reload({ stream: true }))
  );
});

//watch
gulp.task("watch", function() {
  gulp.watch("src/scss/**/*.*", gulp.series("css"));
  gulp.watch("app/*.html", gulp.series("html"));
});

//build
gulp.task("build", function() {
	return gulp.src('./app/*.css')
	.pipe(gulp.dest('D:/Clouds/Mega/Freelance/Active/MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom/web//css'))
	.pipe(gulp.dest('D:/Clouds/Mega/Freelance/Active/MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_au/web//css'))
	.pipe(gulp.dest('D:/Clouds/Mega/Freelance/Active/MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_ca/web//css'))
	.pipe(gulp.dest('D:/Clouds/Mega/Freelance/Active/MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_eu/web//css'))
	.pipe(gulp.dest('D:/Clouds/Mega/Freelance/Active/MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_nz/web//css'))
	.pipe(gulp.dest('D:/Clouds/Mega/Freelance/Active/MOJO_PRODUCTION/app/design/frontend/Pearl/weltpixel_custom_us/web//css'));
});


//watch-inject
gulp.task("watch-inject", function() {
  gulp.watch("src/scss/**/*.*", gulp.series("css-inject"));
});

//server
gulp.task("server", function() {
  browserSync({
    proxy: siteUrl,
    middleware: require("serve-static")("./app"),
    rewriteRules: [
      {
        match: new RegExp(siteCSS),
        fn: function() {
          return "https://mojohealth.net/style.css";
        }
      }
    ]
  });
});

gulp.task("inject", gulp.parallel("css-inject", "watch-inject", "server"));
gulp.task("default", gulp.parallel("css-inject", "watch-inject", "server"));

