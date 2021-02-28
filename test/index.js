const path = require('path')
const {generateData, generatePost} = require('../index')

const dirPath = path.join(process.cwd(), 'test/md')
const ymlPath = path.join(process.cwd(), 'test/config.yml')
const dbPath = path.join(process.cwd(), 'test/db')
const templatePath = path.join(process.cwd(), 'test/md/css/css-1.md')

// generateData(dirPath, ymlPath, dbPath);
