var config = require('./gulpfiles/config.json'),
  files = require('./gulpfiles/files'),
  gulp = require('gulp'),
  del = require('del'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCSS = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  sizereport = require('gulp-sizereport'),
  babel = require('gulp-babel'),
  cssnano = require('cssnano'),
  sorting = require('postcss-sorting'),
  atImport = require('postcss-import'),
  mixins = require('postcss-mixins'),
  conditionals = require('postcss-conditionals'),
  postcssfor = require('postcss-for'),
  postcsseach = require('postcss-each'),
  compactmq = require('postcss-compact-mq'),
  calc = require('postcss-calc'),
  simpleVars = require('postcss-simple-vars'),
  nested = require('postcss-nested'),
  map = require('postcss-map'),
  cssstats = require('cssstats'),
  hexrgba = require('postcss-hexrgba'),
  imagemin = require('gulp-imagemin'),
  svgSymbols = require('gulp-svg-symbols');

gulp.task('default', ['css', 'js']);
gulp.task('compile-all', ['default']);

gulp.task('lint-css', function () {
  return gulp.src(files.globs.css.raw)
    .pipe(sourcemaps.init())
  // .pipe(stylelint(config.stylelint));
});

gulp.task('css', ['lint-css'], function () {
  var processors = [
    atImport(),
    map({ basePath: files.paths.css.maps, maps: files.globs.css.maps }),
    conditionals(),
    postcssfor(),
    postcsseach(),
    mixins(),
    hexrgba(),
    compactmq(),
    nested(),
    calc(),
    simpleVars(),
    autoprefixer(config.autoprefixer),
    cssnano()
  ];

  return gulp.src(files.globs.css.src)
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(files.paths.css.dist))
    .pipe(sizereport());
});

// gulp.task('lint-js', function() {
//   return gulp.src(files.globs.js.src)
//     .pipe(jshint(files.paths.js.jshint + files.globs.js.jshint))
//     .pipe(jshint.reporter(config.jshint_reporter));
// });

gulp.task('js', function () {
  return gulp.src(files.globs.js.src)
    .pipe(sourcemaps.init())
    .pipe(babel(config.babel))
    .pipe(concat(files.globs.js.dist.original))
    .pipe(gulp.dest(files.paths.js.dist))
    .pipe(rename(files.globs.js.dist.minified))
    .pipe(uglify(config.uglify))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(files.paths.js.dist))
    .pipe(sizereport());
});

