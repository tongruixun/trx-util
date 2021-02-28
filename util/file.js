const fs = require('fs');
const path = require('path')
const yaml = require('js-yaml');
const dayjs = require('dayjs');
const {split} = require('./frontMatter');
const MarkdownUtil = require('./marked');

class FileUtil {
    constructor(configPath) {
        this.config = this.parseYml(configPath)
        this.posts = [];
    }

    /**
     * 获取yml文件内容并返回解析结果
     * @param filePath
     * @returns {any}
     */
    parseYml(filePath) {
        const ymlContent = fs.readFileSync(filePath, "utf-8");
        return yaml.load(ymlContent)
    }

    /**
     * 按文章中的时间将数据从新到旧排序
     */
    sortPostsByTime() {
        const tempList = [...this.posts];
        this.posts = tempList.sort((x, y) => {
            return dayjs(x.id).isBefore(dayjs(y.id)) ? 1 : -1;
        })
    }

    /**
     * 读取单个文件的内容
     * @param filePath
     * @returns {string}
     */
    readFileSync(filePath) {
        let result = null;
        try {
            result = fs.readFileSync(filePath, "utf-8");
        } catch {
            result =  null
        }
        return result;
    }

    /**
     * 根据所给路径（targetPath）读取文件
     * 如果targetPath为目录
     * 读取目录下的内容递归调用
     * @param targetPath
     */
    readFiles(targetPath) {
        const result = this.readFileSync(targetPath);
        if(result) {
            const result = this.readFileSync(targetPath);
            this.posts.push(this.getPostData(result));
        } else {
            const files = fs.readdirSync(targetPath)
            files.forEach(item => {
                const curPath = path.join(targetPath, item);
                this.readFiles(curPath);
            })
        }
    }

    /**
     * 将内容写入文件
     * @param data
     * @param dirPath
     * @param fileName
     */
    writeFile(data, dirPath, fileName) {
        const filePath = path.join(dirPath, fileName);
        fs.writeFile(filePath, data, e => {
            // 目录不存在则创建目录
            if (e) {
                if (e.code === 'ENOENT') {
                    fs.mkdir(dirPath, {recursive: true}, err => {
                        if (!err) this.writeFile(data, dirPath, fileName);
                    })
                } else {
                    throw e
                }
            } else {
                console.log('new file: ', filePath)
            }
        });
    }

    /**
     * 将数据封装解析成需要的格式
     * @param data
     * @returns {{prefixSeparator: boolean, data: string, separator: string, content}|{content: string}|{prefixSeparator: boolean, data: string, separator: string, content}|{content: string}}
     */
    getPostData(data) {
        const result = split(data);
        result.data = yaml.load(result.data);
        const obj = new MarkdownUtil();
        obj.parseMarkdown(result.content);
        result.content = obj.content;
        result.directory = obj.toc;
        result.id = dayjs(result.data.date).unix();
        return result
    }

    /**
     * 替换模板中的数据
     * @param templateContent
     * @param title
     * @returns {*}
     */
    replaceTemplateData(templateContent, title) {
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
        return templateContent.replace(/\{\{ title }}/, title).replace(/\{\{ date }}/, now);
    }
}

module.exports = FileUtil;