#! /usr/bin/env node

// 命令行询问用户问题，记录回答结果
const program = require('commander')
const initAction = require('./lib/init')

// 设置脚手架版本
program
    .version('1.0.0', '-v, --version');

program
    .command('create <app-name>') //其中<>代表必填 []代表可选
    .option('-f,--force', '描述性文字')
    .description('创建一个新的项目')
    .action(initAction)
program.parse(process.argv) // 解析用户执行命令传入参数