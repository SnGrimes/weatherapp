var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:80/weatherapp"
    });
    gulp.watch("*.html").on("change", reload);
    gulp.watch("CSS/*.css").on("change", reload);
    gulp.watch("JS/*.js").on("change", reload);

});

gulp.task('default', ['browser-sync']);