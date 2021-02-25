const fs = require('fs');

// 读取目录下的所有markdown  返回文件名组成的数组
function readMarkDownDir(path) {
    return fs.readdirSync(path);
}

// 读取单个文件中的内容
function readFileContent(path) {
    return fs.readFileSync(path, {encoding: "utf-8"});
}

// 将内容写入文件
function writeFile(data, targetFile) {
    fs.writeFile(targetFile, data, e => {
        console.log('new file: ',targetFile)
    });
}

module.exports.readMarkDownDir = readMarkDownDir;
module.exports.readFileContent = readFileContent;
module.exports.writeFile = writeFile;