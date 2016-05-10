var path = require('path');
var combiner = require('stream-combiner2');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var server = require('gulp-express');
var nunjucksRender = require('gulp-nunjucks-render');
var prettify = require('gulp-html-prettify');
var replace = require('gulp-replace');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
//var siteDB = require('./datasource/sdata.json');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var muse = require('./routes/api');
var imagemin = require('gulp-imagemin');
var pngQuant = require('imagemin-pngquant');
var runSequence = require('run-sequence');

gulp.task('less:dev', function() {
    var autoprefix = new LessPluginAutoPrefix({
      browsers: ["last 2 versions"]
    });

  return gulp.src('public/less/style.less')
  	//.pipe(sourcemaps.init())
    .pipe(less({
      plugins: [autoprefix]
    }).on('error', function(err) {
      gutil.log(err);
      this.emit('end');
    }))
    //.pipe(sourcemaps.write('.', {includeContent: false, mapSources: 'public/less/**'}))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('less:prod', function() {
  var cleancss = new LessPluginCleanCSS({
      advanced: true
    }),
    autoprefix = new LessPluginAutoPrefix({
      browsers: ["last 30 versions", "IE 8", "IE 9"]
    });

  return gulp.src('public/less/style.less')
    //.pipe(sourcemaps.init())
    .pipe(less({
      plugins: [autoprefix, cleancss]
    }).on('error', function(err) {
      gutil.log(err);
      this.emit('end');
    }))
    //.pipe(sourcemaps.write('.', {includeContent: false, mapSources: 'public/less/**'}))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('sprites', function() {

  var spriteData = gulp.src('public/__icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.less',
    padding: 10,
    cssTemplate: 'sprites.hbs'
  }));

  var imgStream = spriteData.img
    .pipe(gulp.dest('public/images/'));
  var cssStream = spriteData.css
    .pipe(gulp.dest('public/less/components'));

  return merge(imgStream, cssStream);
});

gulp.task('spriteclouds', function() {
  var part1 = gulp.src('public/__cloudImages/1/*.png').pipe(spritesmith({
    imgName: 'cloudpart1.png',
    cssName: 'sprite.less',
    algorithm: 'top-down',
    algorithmOpts: {sort: false},
    padding: 0
  }));

  var part2 = gulp.src('public/__cloudImages/2/*.png').pipe(spritesmith({
    imgName: 'cloudpart2.png',
    cssName: 'sprite.less',
    algorithm: 'top-down',
    algorithmOpts: {sort: false},
    padding: 0
  }));

  var part3 = gulp.src('public/__cloudImages/3/*.png').pipe(spritesmith({
    imgName: 'cloudpart3.png',
    cssName: 'sprite.less',
    algorithm: 'top-down',
    algorithmOpts: {sort: false},
    padding: 0
  }));

  var part4 = gulp.src('public/__cloudImages/4/*.png').pipe(spritesmith({
    imgName: 'cloudpart4.png',
    cssName: 'sprite.less',
    algorithm: 'top-down',
    algorithmOpts: {sort: false},
    padding: 0
  }));


 return part1.img.pipe(gulp.dest('public/__cloudSprites/')).on('end', function() {

    return part2.img.pipe(gulp.dest('public/__cloudSprites/')).on('end', function() {
      return part3.img.pipe(gulp.dest('public/__cloudSprites/')).on('end', function() {
        return part4.img.pipe(gulp.dest('public/__cloudSprites/'));
      });
    });
  });
});

gulp.task('optclouds', function() {
  return  gulp.src(['public/__cloudSprites/*.png'])
    .pipe(imagemin([pngQuant({quality: '65-80', speed: 4})]))
    .pipe(gulp.dest('public/blob/'));
});

gulp.task('default', function() {
 
  server.run(['bin/www'], [], [true]);

  gulp.watch(['views/**/*.html', 'views/*.html', 'public/datasource/*.json', './app.js', 'routes/**/*.js'], function(event) {
    server.notify(event);
    console.log(path.basename(event.path), 'was', event.type);
    server.stop();
    server.run(['bin/www'])
  });
  gulp.watch(['public/__icons/*.png'], ['sprites', server.notify]);
  gulp.watch(['public/less/*.less', 'public/less/**/*.less'], ['less:dev', server.notify]);
});


gulp.task('export', function() {
  nunjucksRender.nunjucks.configure(['views/'], {
    watch: false
  });
  var images = new RegExp('src=+([\'\"])\/images\/(.[^\'\"]+)', 'g');
  var scripts = new RegExp('src=+([\'\"])\/javascripts\/(.[^\'\"]+)', 'g');

  gulp.src(['views/*.html', '!views/__*.html'])
    .pipe(nunjucksRender({
      isExport: true,
      //ctx: siteDB
    }))
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(replace(images, 'src=$1@File("/files/images/$2")'))
    .pipe(replace(scripts, 'src=$1@File("/files/js/$2")'))
    .pipe(gulp.dest('export'));
});


/*gulp.task('clouds', function() {
  runSequence('spriteclouds', 'optclouds')
});*/

gulp.task('publish', ['less:prod']);