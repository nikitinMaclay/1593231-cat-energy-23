const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const webp = require("gulp-webp");
const del = require("del");
const svgMin = require("gulp-svgmin");
// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Html minify
const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// script minify
const script = () => {
  return gulp.src("source/js/main-nav.js")
    .pipe(terser())
    .pipe(rename("main-nav.min.js"))
    .pipe(gulp.dest("build/js"));
}

exports.script = script;

const script2 = () => {
  return gulp.src("source/js/map-popup.js")
    .pipe(terser())
    .pipe(rename("map-popup.min.js"))
    .pipe(gulp.dest("build/js"));
}

exports.script2 = script2;
// images

const copyImages = () => {
  return gulp.src("source/img/**/*.{jpg,svg,png}")
    .pipe(gulp.dest("build/img"));
}

exports.copyImages = copyImages;

// svg images

const svgImages = () => {
  return gulp.src("source/img/**/*.svg")
  .pipe(svgMin())
  .pipe(gulp.dest("build/img"));
}

exports.svgImages = svgImages;

// webp
const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
}

exports.createWebp = createWebp;

// copySprite

const sprite = () => {
  return gulp.src("source/img/sprite.svg")
  .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/img/**/*.svg",
    "source/*.ico",
    "source/manifest.webmanifest",
    "!source/img/icons/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/main-nav.js", gulp.series(script));
  gulp.watch("source/js/map-popup.js", gulp.series(script2));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// Build

const build = gulp.series(
  clean,
  copy,
  copyImages,
  svgImages,
  gulp.parallel(
    styles,
    html,
    script,
    script2,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default


exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    script,
    script2,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
