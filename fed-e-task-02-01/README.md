# 1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。
工程化是在遵循一定规范， 依靠工具提升效率，降低成本的手段。
1、可以解决语法的弊端，通过工程化的手段将新语法转换成兼容性好的语法；
2、通过devServer模块，转发api，解决本地跨域问题，并支持热更新，提升开发效率
3、可以mock数据，模拟接口调用，可以和后端人员并行开发。
4、统一编码风格，更好维护。

# 2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？
更深的意义在于统一，可以提供项目规范和一些公共约定，还可以提供相同的组织结构、相同的模块依赖、相同的工具配置、相同的基础代码等，大大提高开发效率。



# 编程题说明
### 1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具
一、通过npm 创建package.json 文件 ，项目名称为sample-scaffolding   
二、在package.json中创建一个bin字段，值为入口文件。    
三、入口文件实现  
1、通过 inquirer 模块实现用户交互问题。  
2、通过ejs模块实现模板生成
具体代码如下
```
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer.prompt([
    {
        type:'input',//类型
        name: 'name',//字段
        message: 'project name is:'//问题描述
    }
])
.then(answer =>{
    //模板目录
    const temlDir = path.join(__dirname, 'templates')
    //目标目录
    const destDir = process.cwd()
    //讲模板下的文件全部转换到目标目录
    fs.readdir(temlDir , (err, files)=>{
        if(err) throw err;
        files.forEach(file=>{
            //通过模板引擎渲染文件
            ejs.renderFile(path.join(temlDir, file), answer, (err, result)=>{
                if(err) throw err;
                //将结果写入目标文件
                fs.writeFileSync(path.join(destDir, file), result)
            })
        })
    })

})



```
四、 npm link 命令，把项目link到全局，就可以通过项目名称（sample-scaffolding ）直接运行。

### 2、尝试使用 Gulp 完成 项目 的自动化构建
1、流程用到到一些模块和功能
```
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
```
2、下载所需模块创建任务
```
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
```
3、对外提供构建和开发命令
```
const compile = parallel(style, script, page)
const build = series(clean,parallel(series(compile,useref) ,image,font,extra)) 
const develop = series(compile, serve)
module.exports = {
    build,
    develop
}
```
### 3、尝试使用 Grunt 完成 项目 的自动化构建

1、流程用到到一些模块和功能
```
//scss文件解析
const sass = require('sass');
//自动加载grunt插件任务
const loadGruntTasks = require('load-grunt-tasks');
//browserSync构建虚拟服务器实现热更新
const browserSync = require('browser-sync')
const bs = browserSync.create()

const data = {
    menus: [],
    pkg: require('./package.json'),
    date: new Date()
}
```
2、下载所需模块创建任务
```
module.exports = function (grunt) {

    // 插件配置项通过grunt.initConfig来初始化
    grunt.initConfig({
        sass: {
            options: {
                implementation: sass,
                style: 'expanded'// compressed
            },
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/styles/',
                    src: [
                        '*.scss'
                    ],
                    dest: 'dist/assets/styles/',
                    ext: '.css'
                }]
            }
        },
        clean: {
            main: {
                files: [{
                    src: 'dist/'
                }]
            }
        },
        babel: {
            options: {
                presets: ['@babel/preset-env']
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/assets/scripts/',
                        src: [
                            '*.js'
                        ],
                        dest: 'dist/assets/scripts/'
                    }
                ],
                // files: {
                //     // 'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
                //     'dist/assets/scripts/worker.js': 'src/assets/scripts/worker.js'
                // }
            }
        },
        web_swig: {
            options: {
                swigOptions: {
                    cache: false
                },
                getData: function (tpl) {
                    return data; // 传递参数
                }
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '*.html'
                        ],
                        dest: 'dist/'
                    }
                ]
            }
        },
        // imagemin: {
        //     main: {
        //         options: {
        //             optimizationLevel: 1,
        //             pngquant: true
        //         },
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: 'src/assets/images/',
        //                 src: ['*.{png,jpg,gif,svg}'],
        //                 dest: 'dist/assets/images/'
        //             }
        //         ]
        //     }
        // },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/',
                        src: [
                            '**',
                        ],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/fonts/',
                        src: [
                            '*.{eot,svg,ttf,woff}',
                        ],
                        dest: 'dist/assets/fonts/'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/images/',
                        src: ['*.{png,jpg,gif,svg}'],
                        dest: 'dist/assets/images/'
                    }
                ]
            }
        },
        
        watch: {//watch使用grunt-contrib-watch监听html css  js文件的增删改查
            js: {
              files: ['src/assets/scripts/*.*'],
              tasks: ['babel', 'bs-reload']
            },
            css: {
              files: ['src/assets/styles/*.*'],
              tasks: ['sass', 'bs-reload']
            },
            html: {
              files: ['src/**/*.html'],
              tasks: ['web_swig', 'bs-reload']
            }
        },
    });

      // 启动browserSync，开启服务，实现热更新
      grunt.registerTask("bs", function () {
        const done = this.async();
        bs.init({
            notify: false,
            port: 3000,
            open: true,
            files: 'dist/**',
            server: {
                baseDir: ['dist', 'src', 'public'], // 按顺序查找
                routes: {
                '/node_modules': 'node_modules'
                }
            }
            }, function (err, bs) {
                done();
            });
        });
    // 包装一下broswerSync的重新加载任务
    grunt.registerTask("bs-reload", function () {
        bs.reload()
    });

    loadGruntTasks(grunt);  // 自动加载插件
```
3、对外提供构建和开发命令
```
grunt.registerTask('compile', ['sass', 'babel', 'web_swig'])

    
grunt.registerTask('build', ['compile', 'copy']);//构建

grunt.registerTask('serve', ['compile', 'bs', 'watch'])//开发
```

