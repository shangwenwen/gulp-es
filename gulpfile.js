 'use strict';

 /**
  * [ gulp node_modules ]
  * ---------------------
  */
 var path = require('path');
 var fs = require('fs');
 var gulp = require('gulp');
 var browserSync = require('browser-sync').create();
 var concat = require('gulp-concat'); // 合并文件
 var imagemin = require('gulp-imagemin'); // 压缩图片
 var sass = require('gulp-sass'); // 编译 sass 文件
 var base64 = require('gulp-css-base64'); // 生成 base64 图片文件
 var cssmin = require('gulp-cssmin'); // 压缩样式文件
 var spriter = require('gulp-css-spriter'); // 雪碧图
 var fileInclude = require('gulp-file-include'); // html 文件引入
 var source = require('vinyl-source-stream');
 var browserify = require('browserify'); // js 模块化
 var watchify = require('watchify');
 var factor = require('factor-bundle'); // 分割模块
 var sourcemaps = require("gulp-sourcemaps");
 var buffer = require('vinyl-buffer');
 var uglify = require('gulp-uglify'); // js 混淆
 var del = require('del'); // 清除目录
 var zip = require('gulp-zip'); // 生成压缩包
 var sequence = require('gulp-sequence'); // 任务执行顺序
 var notify = require("gulp-notify");
 var rev = require('gulp-rev');
 var revCollector = require('gulp-rev-collector');

 /**
  * [ gulp tasks ]
  * --------------
  */

 // 错误处理 handleError
 function handleError() {
 	var args = Array.prototype.slice.call(arguments);

 	// Send error to notification center with gulp-notify
 	notify.onError({
 		title: "Compile Error",
 		message: "<%= error.message %>"
 	}).apply(this, args);

 	// Keep gulp from hanging on this task
 	this.emit('end');
 };


 // BROWSERIFY 模块化打包 JS(利用 watchify 提高性能，利用 factor bundle 分割代码)， 依赖 COPY:JS 任务
 gulp.task('COPY:JS', function() {
 	return gulp.src('./app/_assets/js/*.js')
 		.pipe(gulp.dest('./build/dev/_assets/js/'))
 });

 gulp.task('COPY1:JS', function() {
 	return gulp.src('./app/_assets/js/*.js')
 		.pipe(gulp.dest('./build/prod/_assets/js/'))
 });

 gulp.task('BROWSERIFY:JS', ['COPY:JS'], function() {

 	// 获取多页面的每个 JS 入口文件
 	function getEntry() {
 		var jsDir = path.resolve(process.cwd(), './app/_assets/js/');
 		var dirs = fs.readdirSync(jsDir);
 		var matchs = [];
 		var entryFiles = [];

 		dirs.forEach(function(item) {
 			matchs = item.match(/(.+)\.js$/);
 			if (matchs) {
 				entryFiles.push('./app/_assets/js/' + matchs[1] + '.js');
 			}
 		});

 		return entryFiles;
 	};

 	// 获取打包生成 JS 文件路径
 	function getOut() {
 		var outFiles = getEntry().map(function(item, index) {
 			return item.replace('./app/_assets/js/', './build/dev/_assets/js/');
 		});

 		return outFiles;
 	};

 	// 初始化 BROWSERIFY 打包任务
 	var b = browserify({
 		entries: getEntry(),
 		cache: {},
 		packageCache: {},
 		plugin: [watchify, [factor, {
 			outputs: getOut()
 		}]],
 		debug: true
 	});

 	function bundle() {
 		b.bundle()
 			.on('error', handleError)
 			.pipe(source("common.js"))
 			.pipe(buffer())
 			.pipe(sourcemaps.init({
 				loadMaps: true
 			}))
 			.pipe(sourcemaps.write('.'))
 			.pipe(gulp.dest('./build/dev/_assets/js/'))
 			.pipe(browserSync.stream());
 	};

 	b.on('update', bundle);

 	b.on('log', console.log.bind(console));

 	bundle();

 });


 gulp.task('BUILD:JS', ['COPY1:JS'], function() {

 	// 获取多页面的每个 JS 入口文件
 	function getEntry() {
 		var jsDir = path.resolve(process.cwd(), './app/_assets/js/');
 		var dirs = fs.readdirSync(jsDir);
 		var matchs = [];
 		var entryFiles = [];

 		dirs.forEach(function(item) {
 			matchs = item.match(/(.+)\.js$/);
 			if (matchs) {
 				entryFiles.push('./app/_assets/js/' + matchs[1] + '.js');
 			}
 		});

 		return entryFiles;
 	};

 	// 获取打包生成 JS 文件路径
 	function getOut() {
 		var outFiles = getEntry().map(function(item, index) {
 			return item.replace('./app/_assets/js/', './build/prod/_assets/js/');
 		});

 		return outFiles;
 	};

 	// 初始化 BROWSERIFY 打包任务
 	var b = browserify({
 		entries: getEntry(),
 		cache: {},
 		packageCache: {},
 		plugin: [watchify, [factor, {
 			outputs: getOut()
 		}]],
 		debug: true
 	});

 	function bundle() {
 		b.bundle()
 			.on('error', handleError)
 			.pipe(source("common.js"))
 			.pipe(buffer())
 			.pipe(sourcemaps.init({
 				loadMaps: true
 			}))
 			.pipe(sourcemaps.write('.'))
 			.pipe(gulp.dest('./build/prod/_assets/js/'));
 	};

 	return bundle();

 });


 // 拷贝压缩图片。
 gulp.task('COPY:IMG', function() {
 	return gulp.src('./app/_assets/img/**/*.{JPG,jpg,png,gif,svg}')
 		.pipe(imagemin())
 		.pipe(gulp.dest('./build/dev/_assets/img/'))
 		.pipe(browserSync.stream());
 });

 gulp.task('BUILD:IMG', ['COPY:IMG'], function() {
 	return gulp.src('./build/dev/_assets/img/**/*.{JPG,jpg,png,gif,svg}')
 		.pipe(gulp.dest('./build/prod/_assets/img/'))
 });

 // 编译 HTML。
 gulp.task('COPY:HTML', function() {
 	return gulp.src('./app/*.html')
 		.pipe(fileInclude({
 			prefix: '@',
 			basepath: '@file'
 		}))
 		.pipe(gulp.dest('./build/dev/'))
 		.pipe(browserSync.stream());
 });

 gulp.task('BUILD:HTML', ['COPY:HTML'], function() {
 	return gulp.src('./build/dev/*.html')
 		.pipe(gulp.dest('./build/prod/'));
 });

 // 编译 SASS。
 gulp.task('COPY:SASS', function() {
 	return gulp.src(['./app/_assets/css/**/*.scss', './node_modules/font-awesome/css/font-awesome.min.css', './node_modules/bootstrap-select/dist/css/bootstrap-select.min.css', '!./app/_assets/css/bootstrap/*.scss', '!./app/_assets/css/app/*.scss'])
 		.pipe(sass.sync().on('error', sass.logError))
 		.pipe(gulp.dest('./build/dev/_assets/css/'))
 		.pipe(browserSync.stream());
 });

 gulp.task('BUILD:SASS', ['COPY:SASS'], function() {
 	// 时间戳 timestamp
 	var timestamp = +new Date();

 	return gulp.src('./build/dev/_assets/css/*.css')
 		.pipe(spriter({
 			spriteSheet: './build/prod/_assets/img/spritesheet' + timestamp + '.png',
 			pathToSpriteSheetFromCSS: '../img/spritesheet' + timestamp + '.png',
 			spritesmithOptions: {
 				padding: 10
 			}
 		}))
 		.pipe(base64({
 			baseDir: './',
 			maxWeightResource: 20 * 1024,
 			extensionsAllowed: ['.gif', '.jpg', '.png']
 		}))
 		.pipe(cssmin())
 		.pipe(gulp.dest('./build/prod/_assets/css/'));
 });

 // 拷贝字体。
 gulp.task('COPY:FONTS', function() {
 	return gulp.src('./node_modules/font-awesome/fonts/*.*')
 		.pipe(gulp.dest('./build/dev/_assets/fonts/'))
 		.pipe(browserSync.stream());
 });

 gulp.task('BUILD:FONTS', function() {
 	return gulp.src('./node_modules/font-awesome/fonts/*.*')
 		.pipe(gulp.dest('./build/prod/_assets/fonts/'));
 });

 // 清空目录。
 gulp.task('CLEAN', function() {
 	return del(['./build/', './prod.zip']).then(function() {
 		console.log('-----------------------');
 		console.log('      删除成功！！     ');
 		console.log('-----------------------');
 	});
 });

 // 生成压缩文件
 gulp.task('BUILD:ZIP', function() {
 	return gulp.src('./build/dev/**/*')
 		.pipe(zip('prod.zip'))
 		.pipe(gulp.dest('./'));
 });

 // REV COLLECTOR CSS/JS文件添加时间戳。
 gulp.task('REV', function() {
 	return gulp.src(['./build/prod/_assets/css/*.css', './build/prod/_assets/js/*.{js,map}'], {
 			base: './build/prod/'
 		})
 		.pipe(gulp.dest('./build/prod/'))
 		.pipe(rev())
 		.pipe(gulp.dest('./build/prod/'))
 		.pipe(rev.manifest({
 			path: 'manifest.json'
 		}))
 		.pipe(gulp.dest('./build/prod/_assets/'));
 });

 gulp.task('REV:COLLECTOR', function() {
 	return gulp.src(['./build/prod/_assets/manifest.json', './build/prod/**/*.{html,xml,txt,json,css,js}'])
 		.pipe(revCollector())
 		.pipe(gulp.dest('./build/prod/'));
 });

 // 添加本地服务，浏览器自动刷新，文件修改监听。
 gulp.task('BROWSER:WATCH', function() {
 	browserSync.init({
 		server: {
 			baseDir: './',
 			directory: true,
 		},
 		reloadDelay: 0,
 		timestamps: true,
 		startPath: "./build/dev/",
 		port: 8000
 	});
 	gulp.watch('./app/_assets/css/**/*', ['COPY:SASS']);
 	gulp.watch('./app/**/*.html', ['COPY:HTML']);
 	gulp.watch('./app/_assets/img/**/*.{JPG,jpg,png,gif,svg}', ['COPY:IMG']);
 	gulp.watch('./build/dev/**/*.html').on("change", browserSync.reload);
 });


 // 开发 DEV
 gulp.task('DEV', sequence('CLEAN', ['COPY:HTML', 'COPY:SASS', 'BROWSERIFY:JS', 'COPY:IMG', 'COPY:FONTS'], 'BROWSER:WATCH'));

 // 打包发布 PROD
 gulp.task('PROD', sequence('CLEAN', ['BUILD:HTML', 'BUILD:SASS', 'BUILD:IMG', 'BUILD:JS', 'BUILD:FONTS'], 'REV', 'REV:COLLECTOR', 'BUILD:ZIP'));