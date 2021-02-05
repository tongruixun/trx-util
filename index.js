const yaml = require('js-yaml');
const dayjs = require('dayjs');

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

    writeFile(getPostsData(postSPath), `${targetPath}/posts.json`);
    writeFile(parseYml(ymlPath), `${targetPath}/config.json`);
}

module.exports.generateData = generateData;
