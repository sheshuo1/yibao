var gulp = require('gulp'),
    path = require('path'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-clean-css'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    fontSpider = require( 'gulp-font-spider'),
    htmlmin = require('gulp-htmlmin'),
    runSequence = require('run-sequence');


var cssSrc = 'src/css/*.css',
    cssDest = 'dist/css',
    jsSrc = 'src/js/*.js',
    jsDest = 'dist/js',
    fontSrc = 'src/fonts/*',
    fontDest = 'dist/fonts',
    imgSrc = 'src/images/src/*.{png,jpg,gif}',
    imgDest = 'dist/images',
    cssRevSrc = 'src/css/revCss';



//自动刷新页面
gulp.task('reload',function() {
    livereload.reload();
});

//监听文件变动
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('**/*.*', ['reload']);
});


//监听文件变动
gulp.task('watch-less', function() {
    gulp.watch('src/css/*.less', ['less']);
});

//自动添加css前缀
gulp.task('autofx', function () {
    gulp.src(cssSrc)
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0','> 5%'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        // .pipe(rename({ suffix: '.fx' }))
        .pipe(gulp.dest('src/css'));
});

//自动编译less文件
gulp.task('less',function(){
    gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});

//压缩图片
gulp.task('imagemin', function() {
    gulp.src(imgSrc)
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('src/images/min/src'));
});

//压缩js文件
gulp.task('minjs', function() {
    return gulp.src(jsSrc)
        .pipe(uglify())
        //.pipe(rename({ suffix: '.min' }))
        .pipe(rev())
        .pipe(gulp.dest(jsDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/js'));
});

//CSS里更新引入文件版本号
gulp.task('revCollectorCss', function () {
    return gulp.src(['src/rev/**/*.json', cssSrc])
        .pipe(revCollector())
        .pipe(gulp.dest(cssRevSrc));
});


//压缩css文件
gulp.task('mincss',function() {
    return gulp.src(cssSrc)
        .pipe(autoprefixer({
            browsers: ['last 2 versions','ie >=9', 'Android >= 4.0','> 5%'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifyCSS({compatibility: 'ie8'}))
        //.pipe(rename({ suffix: '.min' }))
        // .pipe(rev())
        .pipe(gulp.dest(cssDest));
        // .pipe(rev.manifest())
        // .pipe(gulp.dest('src/rev/css'));
});

//压缩Html/更新引入文件版本
gulp.task('minhtml', function () {
    return gulp.src(['src/rev/**/*.json', 'src/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist'));
});

//字蛛
gulp.task('fontspider', function() {
    return gulp.src('index.html')
        .pipe(fontSpider());
});

//Fonts & Images 根据MD5获取版本号
gulp.task('revFont', function(){
    return gulp.src(fontSrc)
        .pipe(rev())
        .pipe(gulp.dest(fontDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/font'));
});
gulp.task('revImg', function(){
    return gulp.src(imgSrc)
        .pipe(rev())
        .pipe(gulp.dest(imgDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/img'));
});


//正式构建
gulp.task('build', function (done) {
    runSequence(
        ['less','revFont','revImg'],
        ['revCollectorCss'],
        ['mincss', 'minjs'],
        ['minhtml'],
        done);
});


gulp.task('help', function() {
    console.log('  gulp watch           自动刷新页面');
    console.log('  gulp imagemin        压缩图片');
    console.log('  gulp minjs           压缩JS');
    console.log('  gulp mincss          压缩CSS');
    console.log('  gulp minhtml         压缩HTML');
    console.log('  gulp less            编译less');
    console.log('  gulp autofx          自动添加CSS前缀');
    console.log('  gulp build           版本构建');
    console.log('  gulp help            使用帮助');
});



gulp.task('default',function(){
    gulp.start('help');
});