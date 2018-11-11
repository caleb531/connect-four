let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let sass = require('gulp-sass');
let rollup = require('rollup');
let rollupAppConfig = require('./rollup.config.app.js');
let rollupTestConfig = require('./rollup.config.test.js');
let workboxBuild = require('workbox-build');

gulp.task('assets', () => {
  return gulp.src('app/assets/**/*')
    .pipe(gulp.dest('public'));
});
gulp.task('assets:watch', () => {
  return gulp.watch('app/assets/**/*', gulp.series('assets:core', 'sw'));
});

gulp.task('sass', () => {
  return gulp.src('app/styles/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/styles'));
});
gulp.task('sass:watch', () => {
  return gulp.watch('app/styles/**/*.scss', gulp.series('sass', 'sw'));
});

gulp.task('rollup:app', () => {
  return rollup.rollup(rollupAppConfig).then((bundle) => {
    return bundle.write(rollupAppConfig.output);
  });
});
gulp.task('rollup:test', () => {
  return rollup.rollup(rollupTestConfig).then((bundle) => {
    return bundle.write(rollupTestConfig.output);
  });
});
gulp.task('rollup:watch', () => {
  return gulp.watch(
    ['app/scripts/**/*.js', 'test/**/*.js'],
    gulp.series('rollup', 'sw')
  );
});
gulp.task('rollup', gulp.parallel(
  'rollup:app',
  'rollup:test'
));


gulp.task('sw', () => {
  return workboxBuild.injectManifest({
    globDirectory: 'public',
    globPatterns: [
      '**\/*.{html,js,css,svg,png}'
    ],
    swSrc: 'app/scripts/service-worker.js',
    swDest: 'public/service-worker.js'
   }).then(({ warnings }) => {
    warnings.forEach(console.warn);
  });
});

gulp.task('build', gulp.series(
  gulp.parallel(
    'assets',
    'sass',
    'rollup'
  ),
  'sw'
));
gulp.task('build:watch', gulp.series(
  'build',
  gulp.parallel(
    'assets:watch',
    'sass:watch',
    'rollup:watch'
  )
));
