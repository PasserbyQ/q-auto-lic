// 命令行交互
const inquirer = require('inquirer');
// loading效果
const ora = require('ora');
// 给字体增加颜色
const chalk = require('chalk');
// 文件
const fs = require('fs');
// 处理模板
const handlebars = require('handlebars');
// 获取项目
const create = require('./create');


const questions = [
    // 输入项目描述
    {
        type: 'input',
        name: 'description',
        message: '请输入项目描述：'
    },
    {
        type: 'list',
        message: '请选择项目模版:',
        name: 'repo',
        choices: [
            "vite-ts",
        ],
    }
    // 选择是否使用node-sass或者less
    // {
    //     type: 'confirm',
    //     name: 'cssStyle',
    //     message: '是否使用sass：'
    // },
    // // 选择使用node-sass或者less
    // {
    //     type: 'list',
    //     message: '请选择以下css预处理器:',
    //     name: 'preprocessor',
    //     choices: [
    //         "less",
    //         "sass"
    //     ],
    //     // 只有当用户在选择是否使用node-sass或者less时输入了yes才会显示该问题
    //     when: function (answers) {
    //         return answers.cssStyle
    //     }
    // }
]

const initAction = async (name, option) => {
    const answers = await inquirer.prompt(questions);
    let params = {
        name: answers.name || name, // 项目名称
        description: answers.description,// 项目描述
        author: answers.author // 项目作者
    }
    if (answers.cssStyle) {
        //用户选择使用css预处理器

        if (answers.preprocessor === 'less') {
            // 用户选择使用less
            params.less = true;
            params.sass = false;
        } else if (answers.preprocessor === 'sass') {
            // 用户选择使用sass
            params.less = false;
            params.sass = true;
        }
    } else {
        // 用户选择不使用css预处理器
        params.sass = false;
        params.less = false
    }
    // 打印空行，使输出与输出之间有空行，增加体验效果
    console.log("");
    // 下载模板到本地
    const project = await create(name, option)
    console.log("");

    // 获取模板的package.json的路径
    let packagePath = `${name}/package.json`;
    // 读取模板的package.json文件的内容
    let packageStr = fs.readFileSync(packagePath, 'utf-8');
    // 根据params参数替换掉模板的package.json文件内容的占位符
    let package = handlebars.compile(packageStr)(params);
    // 重新写入文件
    fs.writeFileSync(packagePath, package);
    if (params.sass) {
        // 由于国内网络原因，node-sass可能需要翻墙才能下载，所以如果用户选择了sass预处理器则需要创建.npmrc文件，并写入node-sass的代理下载地址
        const npmrcPath = `${name}/.npmrc`;
        const appendContent = '\r\nsass_binary_site=https://npm.taobao.org/mirrors/node-sass/'
        if (!fs.existsSync(npmrcPath)) {
            fs.writeFileSync(npmrcPath, appendContent)
        } else {
            fs.appendFileSync(npmrcPath, appendContent)
        }
    }
    console.log(`\r\n成功创建项目 ${chalk.cyan(name)}`);
    console.log(`\r\n  cd ${chalk.cyan(name)}`);
    console.log('  npm run dev\r\n');
}
module.exports = initAction;