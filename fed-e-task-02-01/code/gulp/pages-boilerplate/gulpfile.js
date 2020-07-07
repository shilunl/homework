//gulp提供的功能
const {src, dest, parallel,series, watch} = require('gulp')

//清除模块
const del = require('del')
//服务模块
const browserSync = require('browser-sync')
const bs = browserSync.create()
//gulp提供的自动加载gulp的插件
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins();

//模板默认数据
const data = {
    menus:[],
    pkg:require('./package.json'),
    date:new Date()
}
const style = ()=>{ //处理 scss文件
    return src('src/assets/styles/*.scss',{'base':'src'})
        .pipe(plugins.sass({outputStyle:"expanded"}))
        .pipe(dest('temp'))
}

const script = ()=>{ //处理 js文件
    return src('src/assets/scripts/*.js',{'base':'src'})
        .pipe(plugins.babel({presets:['@babel/preset-env']}))
        .pipe(dest('temp'))
}

const page = ()=>{ //处理模板
    return src('src/*.html',{'base':'src'})
        .pipe(plugins.swig({data:data}))
        .pipe(dest('temp'))
}

const image = ()=>{ //处理 图片
    return src('src/assets/iamges/**',{'base':'src'})
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}
const font = ()=>{ //处理 font图片
    return src('src/assets/fonts/**',{'base':'src'})
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const useref = ()=>{
    return src('temp/*.html',{'base':'temp'})
    .pipe(plugins.useref({
        searchPath:['temp','.']
    }))
    .pipe(plugins.if(/\.js$/,plugins.uglify()))
    .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/,plugins.htmlmin({
        collapseWhitespace: true,
        minifyCSS:true,
        minifyJS:true
    })))
    .pipe(dest('dist'))
}

const extra = ()=>{ //复制无需处理的文件
    return src('public/**',{'base':'public'})
    .pipe(dest('dist'))
}

const clean = ()=>{ //删除指定文件
    return del(['dist','temp'])
}

const serve = ()=>{ //利用brower-sync模块，实现本地开发服务器
    watch('src/assets/styles/*.scss',style)
    watch('src/assets/scripts/*.js',script)
    watch('src/*.html',page)
    // watch('src/assets/iamges/**',image)
    // watch('src/assets/fonts/**',font)
    // watch('public/**',extra)
    watch([
        'src/assets/iamges/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)
    
    bs.init({
        notify:false,//关闭默认展示
        port:3000,//端口号 ，默认3000
        open:true,//是否自动打开网页，默认true
        files:'dist/**',//监控文件变化，自动刷新  
        server:{
            baseDir: ['dist','src','public'],  //支持数组，多个路径
            routes:{
                '/node_modules':'node_modules'
            }
        }
    })
}

const compile = parallel(style, script, page)
const build = series(clean,parallel(series(compile,useref) ,image,font,extra)) 
const develop = series(compile, serve)
module.exports = {
    build,
    develop
}
