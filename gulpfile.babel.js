import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import pug from 'gulp-pug'
import browserSync from 'browser-sync'
import babel from 'gulp-babel'
import plumber from 'gulp-plumber'
import cachebust from 'gulp-cache-bust'
import imagemin from 'gulp-imagemin'
import gulpSequence from 'gulp-sequence'

const server = browserSync.create();

var buildIncludes = ['src/**/*.*','!src/pug/*.pug','!src/scss/*.scss','!src/js/*.js','!src/img/*'];

gulp.task('dev-pug',()=>{
    gulp.src('./src/pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
            baseDir: './src/pug'
        }))
        .pipe(gulp.dest('./public'))
})

gulp.task('build-pug',()=>{
    gulp.src('./src/pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            baseDir: './src/pug'
        }))
        .pipe(gulp.dest('./public'))
})

gulp.task('dev-sass',()=>{
    gulp.src('./src/scss/style.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: false
        }))
        .pipe(autoprefixer({
            browsers: [
                        'last 3 versions',
                        '> 2%',
                        'ie >= 10',
                        'ie_mob >= 10',
                        'ff >= 30',
                        'chrome >= 34',
                        'safari >= 7',
                        'opera >= 23',
                        'ios >= 7',
                        'android >= 4',
                        'bb >= 10'
                    ]
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(server.stream())
})

gulp.task('build-sass',()=>{
    gulp.src('./src/scss/style.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed',
            sourceComments: false
        }))
        .pipe(gulp.dest('./public/css'))
})

gulp.task('dev-babel',()=>{
    gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./public/js'))
})

gulp.task('build-babel',()=>{
    gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./public/js'))
})

gulp.task('dev-img',()=>{
    gulp.src('./src/img/*')
        .pipe(gulp.dest('./public/assets/img'))
        .pipe(server.stream())
})

gulp.task('build-img',()=>{
    gulp.src('./src/img/*')
        .pipe(gulp.dest('./public/assets/img'))
})

gulp.task('cache',()=>{
    gulp.src('./public/*.html')
        .pipe(cachebust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest('./pubic'))
})

gulp.task('dev',['dev-pug','dev-sass','dev-babel','dev-img'],()=>{
    server.init({
        server: {
            baseDir: './public'
        },
        open: true,
        injectChanges: true,
        options: {
            reloadDelay: 100
        }
    })
    gulp.watch('./src/scss/*.scss',()=> gulp.start('dev-sass'))
    gulp.watch('./src/pug/*.pug',()=> gulp.start('dev-pug',server.reload))
    gulp.watch('./src/js/*.js',()=> gulp.start('dev-babel',server.reload))
    gulp.watch('./src/img/*',()=> gulp.start('dev-img',server.reload))
})

gulp.task('copy',()=>{
    gulp.src(buildIncludes)
        .pipe(gulp.dest('./public'))
})

//gulp.task('build',gulpSequence('build-sass','build-pug','build-babel','build-img','copy'))
gulp.task('build',['build-pug','build-sass','build-babel','build-img'])