//用到的一些模块和插件
//scss文件解析
const sass = require('sass');
//自动加载grunt插件任务
const loadGruntTasks = require('load-grunt-tasks');
//browserSync构建虚拟服务器实现热更新
const browserSync = require('browser-sync')
const bs = browserSync.create()

const data = {
    menus: [
        {
            name: 'Home',
            icon: 'aperture',
            link: 'index.html'
        },
        {
            name: 'Features',
            link: 'features.html'
        },
        {
            name: 'About',
            link: 'about.html'
        },
        {
            name: 'Contact',
            link: '#',
            children: [
                {
                    name: 'Twitter',
                    link: 'https://twitter.com/w_zce'
                },
                {
                    name: 'About',
                    link: 'https://weibo.com/zceme'
                },
                {
                    name: 'divider'
                },
                {
                    name: 'About',
                    link: 'https://github.com/zce'
                }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date()
}


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
    //imagemin
    grunt.registerTask('compile', ['sass', 'babel', 'web_swig'])

    
    grunt.registerTask('build', ['compile', 'copy']);

    grunt.registerTask('serve', ['compile', 'bs', 'watch'])
}