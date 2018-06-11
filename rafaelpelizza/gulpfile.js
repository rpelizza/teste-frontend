// Dependências
let gulp = require('gulp');
let rename = require('gulp-rename');
let htmlmin = require('gulp-htmlmin');
let uglify = require('gulp-uglify');
let sass = require('gulp-sass');
let watch = require('gulp-watch');
let child = require('child_process');
let fs = require('fs');


// Task para o sass / css
gulp.task('sass', () => {
	return gulp.src('dev/sass/*.scss').pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)).pipe(gulp.dest('public/assets/css'));
});

// Task para o html base
// gulp.task('html_base', () => {
// 	return gulp.src('dev/html_base/base.html').pipe(rename('base.html')).pipe(gulp.dest('public/angular')).pipe(gulp.dest('public/vuejs'));	
// });
// //

// Task para o html ng
gulp.task('html_ng', () => {	
	return gulp.src('public/angular/base.html').pipe(htmlmin({collapseWhitespace: true})).pipe(rename('index.html')).pipe(gulp.dest('public/angular'));
});

// Task para o js do angular
gulp.task('js_ng', () => {	
	return gulp.src('public/assets/js/angular.js').pipe(uglify()).pipe(rename('theos.min.js')).pipe(gulp.dest('public/assets/js'));
});

// Task para o html vue
gulp.task('html_vue', () => {	
	return gulp.src('public/vuejs/base.html').pipe(htmlmin({collapseWhitespace: true})).pipe(rename('index.html')).pipe(gulp.dest('public/vuejs'));
});

// Task para o watch
gulp.task('watch', () => {
	gulp.watch('dev/sass/*.scss', ['sass']);
	gulp.watch('dev/html_base/base.html', ['html_base']);
	gulp.watch('public/angular/base.html', ['html_ng']);
	gulp.watch('public/assets/js/angular.js', ['js_ng']);
});

gulp.task('default', ['server', 'watch', 'html_ng', 'html_vue', 'js_ng']);

gulp.task('server', () =>{
	let server = child.spawn('node', ['server.js']);
	let log = fs.createWriteStream('server.log', {flags: 'a'});
	server.stdout.pipe(log);
	server.stderr.pipe(log);
});