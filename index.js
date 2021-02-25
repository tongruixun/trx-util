const yaml = require('js-yaml');
const dayjs = require('dayjs');
const path = require('path');

const {split} = require('./util/frontMatter');
const {parseMarkDown} = require('./util/marked');
const {readMarkDownDir, readFileContent, writeFile} = require('./util/file');

/**
 * 将yaml解析成 javascript
 * @param yamlString  符合yaml格式的字符串
 * @returns {any}
 */
function yaml2JavaScript(yamlString) {
    return yaml.load(yamlString)
}

function parsePostData(files, path) {
    const result = [];
    console.log('star read file in', path);
    files.forEach(item => {
        const filePath = `${path}/${item}`;
        // 读取单个markdown文件中的内容
        const mdContent = readFileContent(filePath);
        const postData = split(mdContent);
        const { data, content } = postData;
        postData.data = yaml2JavaScript(data);
        const [article, directory] = parseMarkDown(content);
        postData.content = article;
        postData.directory = directory;
        postData.id = item.split('.')[0];
        result.push(postData);
    })
    console.log('read file end');
    return result;
}

/**
 * 获取所有文章数据
 * @param path
 * @returns []
 */
function getPostsData(path) {
    const files = readMarkDownDir(path);
    const posts = parsePostData(files, path);
    // 按时间排序
    return posts.sort((x, y) => {
        return dayjs(x.data.date).isBefore(dayjs(y.data.date)) ? 1 : -1;
    });
}

/**
 * 获取yml配置文件的JSON格式数据
 * @param path
 * @returns {*}
 */
function parseYml(path) {
    return yaml2JavaScript(readFileContent(path));
}

/**
 * 均为绝对路径
 * @param postSPath  markdown文件的所在目录
 * @param ymlPath    yml文件的位置
 * @param targetPath 数据要写入的目录
 */
function generateData(postSPath, ymlPath, targetPath) {

    const postDataPath = path.join(targetPath, 'posts.json');
    const configDataPath = path.join(targetPath, 'config.json');
    writeFile(JSON.stringify(getPostsData(postSPath), null, '\t'), postDataPath);
    writeFile(JSON.stringify(parseYml(ymlPath), null, '\t'), configDataPath);
}

/**
 * 根据模板文件生成目标文件
 * @param templatePath 模板文件的路径
 * @param targetPath 目标文件所在目录
 * @param title 文件名称
 */
function generatePost(templatePath, targetPath, title) {
    const filePath = path.join(targetPath, `${title}.md`);
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const templateContent = readFileContent(templatePath)
    // 替换标题和时间
    const result = templateContent.replace(/\{\{ title }}/, title).replace(/\{\{ date }}/, now);
    writeFile(result, filePath);
}

module.exports.generateData = generateData;
module.exports.generatePost = generatePost;
