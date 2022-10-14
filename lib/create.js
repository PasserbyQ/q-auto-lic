
const { getRepoList, getTagList } = require('./http.js');
const inquirer = require('inquirer');
const path = require('path');
const util = require('util');
const downloadGitRepo = require('download-git-repo');
const chalk = require('chalk');

async function getRepos() {
    const repoList = await getRepoList()
    const repos = repoList.map(item => item.name)
    const { repo } = await inquirer.prompt([{
        name: 'repo',
        type: 'list',
        choices: repos,
        message: '请选择一个模板'
    }])
    return repo
}
//获取标签
async function getTags(repo) {
    const tagList = await getTagList(repo);
    const tags = tagList.map(item => item.name);
    const { tag } = await inquirer.prompt([{
        name: 'tag',
        type: 'list',
        choices: tags,
        message: '请选择一个版本'
    }])
    return tag;
}
//下载
function onDownload(name, repo, tag) {
    const requestUrl = `PasserbyQ/${repo}${tag ? '#' + tag : ''}`;//创建下载地址
    const cwd = process.cwd(); //获取当前命令行选择的目录
    const targetPath = path.join(cwd, name); //模板下载所在地址
    const downloadFunc = util.promisify(downloadGitRepo);
    return new Promise((resolve, reject) => {
        downloadFunc(requestUrl, targetPath, err => {
            if (err) {
                reject(err)
            } else {
                resolve({ status: true })
            }
        })
    });
}

module.exports = async function (name, options) {
    const downloadUrl = 'PasserbyQ/vite-ts';
    const cwd = process.cwd(); //获取当前命令行选择的目录
    const targetPath = path.join(cwd, name); //模板下载所在地址
    const downloadFunc = util.promisify(downloadGitRepo);
    return new Promise((resolve, reject) => {
        downloadFunc(downloadUrl, targetPath, err => {
            if (err) {
                reject(err)
            } else {
                resolve({ status: true })
            }
        })
    });
    // const repo = await getRepos();
    // const tag = await getTags(repo);
    // return onDownload(name, 'repo', 'tag');
}