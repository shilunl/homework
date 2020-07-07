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
    },
    {
        type: "checkbox",
        message: "选择颜色:",
        name: "color",
        choices: [
            {
                name: "red"
            },
            {
                name: "blur",
                checked: true // 默认选中
            },
            {
                name: "green"
            },
            {
                name: "yellow"
            }
        ]
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


