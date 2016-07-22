import gulp from "gulp"
import uglify from "gulp-uglify"
import sourcemaps from "gulp-sourcemaps"
import named from "vinyl-named"
import connect from "gulp-connect"
import webpack from "webpack-stream"

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

gulp.task("vue", () => {
    return gulp.src(["src/main.js"])
        .pipe(named())
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest("build/"))
        .pipe(connect.reload())
})

gulp.task("vue-minify", ["vue"], () => {
    return gulp.src(["build/main.js"])
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify({ mangle: false }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/"))
        .pipe(connect.reload())
})

gulp.task("watch", ["vue"], () => {
    return gulp.watch("src/**/*", ["vue"])
})

gulp.task("dev", ["watch"], () => {
    return connect.server({ port: 8080, livereload: true, fallback: "index.html" })
})

gulp.task("default", ["vue-minify"])
