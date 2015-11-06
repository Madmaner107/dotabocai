var gulp = require('gulp');
var sass        = require('gulp-sass');
var concatCss = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

/*
PC项目
*/
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var filter      = require('gulp-filter');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');


var paths = {
          styles: [
            "web/scss/ratchet.css",
            "web/scss/ratchet-theme-ios.css",
            "web/scss/swiper.css",
            "web/scss/normalize.css",
            "web/scss/tron.css",
            "web/scss/button.css",
            "web/scss/icon.css",
            "web/scss/tab.css",
            "web/scss/util.css",
            "web/scss/modal.css",
            "web/scss/form.css",
            "web/scss/badage.css",
            "web/scss/corner-ribbon.css",
            "web/scss/table.css",
            "web/scss/bet.css",
            "web/scss/recap.css",
            "web/scss/shop.css",
            "web/scss/user.css",
            "web/scss/bet-history.css",
            "web/scss/about-us.css",
            "web/scss/rule.css",
            "web/scss/pay.css",
            "web/scss/follow-us.css",
            "web/scss/iscroll.css",
            "web/scss/roulette.css",
            "web/scss/campaign.css",
            "web/scss/champion.css",
          ],
          styles_lol: [
            "web/scss/ratchet.css",
            "web/scss/ratchet-theme-ios.css",
            "web/scss/swiper.css",
            "web/scss/normalize.css",
            "web/scss/lol/tron.css",
            "web/scss/lol/button.css",
            "web/scss/lol/icon.css",
            "web/scss/lol/tab.css",
            "web/scss/lol/util.css",
            "web/scss/lol/modal.css",
            "web/scss/lol/form.css",
            "web/scss/lol/badage.css",
            "web/scss/lol/table.css",
            "web/scss/lol/bet.css",
            "web/scss/lol/recap.css",
            "web/scss/lol/shop.css",
            "web/scss/lol/user.css",
            "web/scss/lol/bet-history.css",
            "web/scss/lol/about-us.css",
            "web/scss/lol/rule.css",
            "web/scss/lol/pay.css",
            "web/scss/lol/follow-us.css",
            "web/scss/lol/iscroll.css",
            "web/scss/lol/campaign.css"
          ],
          styles_pc:'web/scss/pc/**/*.scss',
          html_pc:'web/html/*.html',
          js_pc:'web/js/pc/*.js'
};


gulp.task('compress', function (){
  return gulp.src(paths.styles)
      .pipe(sourcemaps.init())
      .pipe(concatCss("web/css/app.css"))
      .pipe(minifyCss())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'))
      .on('error', function (error) {
          console.error('' + error);
      });
});

gulp.task('compress-lol', function (){
  return gulp.src(paths.styles_lol)
      .pipe(sourcemaps.init())
      .pipe(concatCss("web/css/app_lol.css"))
      .pipe(minifyCss())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'))
      .on('error', function (error) {
          console.error('' + error);
      });
});

/*
  PC browser task
*/
gulp.task('browserSync',function(){
  browserSync.init({
    server:'web'
  });

  gulp.watch(paths.styles_pc,['sass_pc']);
  gulp.watch(paths.html_pc).on('change',reload);

});

/*
  PC sass task
*/

gulp.task('sass_pc',function(){
  return gulp.src(paths.styles_pc)
             .pipe(sourcemaps.init())
             .pipe(sass())
             .pipe(minifyCss())
             .pipe(concatCss('app_pc.min.css'))
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest('./web/css'))
             .pipe(filter('app_pc.min.css'))
             .pipe(reload({stream:true}))
});

/*
  PC js task
*/
gulp.task('lint',function(){
  return gulp.src(paths.js_pc)
             .pipe(jshint())
             .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
});

gulp.task('js_pc',function(){
  return gulp.src(paths.js_pc)
             .pipe(uglify())
             .pipe(concatCss('app_pc.min.js'))
             .pipe(gulp.dest('web/js/pc'))
});



gulp.task('watch', function() {
  gulp.watch(paths.styles, ['compress']);
  gulp.watch(paths.styles_lol, ['compress-lol']);
});

gulp.task('default', ['watch', 'compress', 'compress-lol']);
