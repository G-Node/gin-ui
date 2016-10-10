import gulp from "gulp"
import copy from "gulp-copy"
import uglify from "gulp-uglify"
import sourcemaps from "gulp-sourcemaps"
import named from "vinyl-named"
import connect from "gulp-connect"
import webpack from "webpack-stream"

/*
 * Build configuration
 */

const webpack_config = {
    module: {
        loaders: [
            { test: /\.vue$/,  loader: "vue" },
            { test: /\.js$/,   loader: "babel", exclude: /node_modules/ },
            { test: /\.json$/, loader: "json" }
        ]
    },
    output: {
        filename: "[name].js"
    },
    devtool: "source-map"
}


const copy_files = [
    "src/index.html"
]

const connect_config = {
    port: 8080,
    livereload: false,
    root: "build",
    index: "index.html",
    fallback: "build/index.html"
}

/*
 * Define tasks
 */

gulp.task("vue", () => {
    return gulp.src(["src/js/main.js"])
        .pipe(named())
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest("build/js/"))
        .pipe(connect.reload())
})

gulp.task("vue-minify", ["vue"], () => {
    return gulp.src(["build/js/main.js"])
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify({ mangle: false }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/js/"))
        .pipe(connect.reload())
})

gulp.task("copy", () => {
    return gulp.src(copy_files)
        .pipe(copy("build", { prefix: 1 }))
        .pipe(connect.reload())
})

gulp.task("watch", ["vue", "copy"], () => {
    return gulp.watch("src/**/*", ["vue", "copy"])
})

gulp.task("dev", ["watch"], () => {
    return connect.server(connect_config)
})

gulp.task("default", ["vue-minify", "copy"])
