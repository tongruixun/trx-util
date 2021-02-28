const path = require('path');

const FileUtil = require('./util/file');

/**
 * 均为绝对路径
 * @param postsPath  markdown文件的所在目录
 * @param ymlPath    yml文件的位置
 * @param targetPath 数据要写入的目录
 */
function generateData(configPath) {
    const obj = new FileUtil(configPath);
    const {source_dir, posts_dir, datasource_dir, posts_db_name, config_db_name} = obj.config;
    const postsPath = path.join(source_dir, posts_dir);

    console.info('read post for path: ', postsPath);
    console.info('read configData for path: ', configPath);
    obj.readFiles(postsPath);
    obj.sortPostsByTime();
    obj.writeFile(JSON.stringify(obj.posts, null, '\t'), datasource_dir, posts_db_name);
    obj.writeFile(JSON.stringify(obj.parseYml(configPath), null, '\t'), datasource_dir, config_db_name);
}

/**
 * 根据模板文件生成目标文件
 * @param dir 文章所在目录
 * @param configPath 配置文件的路径
 * @param title 文件名称
 */
function generatePost(title, dir, configPath) {
    const obj = new FileUtil(configPath);
    const {source_dir, posts_dir, template_dir, post_template } = obj.config;
    const dirPath = path.join(source_dir, posts_dir, dir);
    const fileName = `${title}.md`;
    const templatePath = path.join(template_dir, post_template);
    const templateContent = obj.readFileSync(templatePath);
    obj.writeFile(obj.replaceTemplateData(templateContent, title), dirPath, fileName);
}

module.exports.generateData = generateData;
module.exports.generatePost = generatePost;
