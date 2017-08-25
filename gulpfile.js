/**
 * Created by uma92 on 2017/02/18.
 */
const gulp = require("gulp");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const watch = require("gulp-watch");
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const browserSync = require('browser-sync').create();
const reload      = browserSync.reload;

// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

// タスクの定義。 ()=> の部分はfunction() でも可



gulp.task('server', ()=> {
    return browserSync.init({
        port:8888,
        server: {
            baseDir: './docs/',
            index:'index.html',
            proxy: "localhost:8888",
            open: false
        }
    })
})


gulp.task('bs-reload', ()=> {
    browserSync.reload();
    done();
});

let paths  = {
    srcDir:"./src",
    dstDir:"./docs"
}

gulp.task('pug', ()=> {
    let pugPath = paths.srcDir + '/pug/*.pug';
    let dstPath = paths.dstDir + '/';
    return gulp.src([pugPath])
        .pipe(plumber())
        .pipe(pug({pretty:true}))
        .pipe(gulp.dest(dstPath))
        .pipe(browserSync.stream());
});


gulp.task('stylus',()=>{
    let stlPath = paths.srcDir + '/stylus/*.styl';
    let dstPath = paths.dstDir + '/css/';
    return gulp.src(stlPath)
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest(dstPath))
        .pipe(browserSync.stream());
});


gulp.task("webpack", ()=>  {
    let dstPath = paths.dstDir + '/js/';
    return gulp.src('./src/ts/*.ts')
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(dstPath));
});


gulp.task('watch',['server'],()=> {
    gulp.watch('src/**/*.pug',['pug']);
    gulp.watch('src/**/*.stylus',['stylus']);
    gulp.watch('src/**/*.ts',['webpack']);
    gulp.watch("docs/*.html").on("change", reload);
    gulp.watch("docs/**/*.css").on("change", reload);
    gulp.watch("docs/**/*.js").on("change", reload);
});

gulp.task("default", ['watch']);

