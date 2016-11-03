const fs = require('fs')

module.exports = {
  // Load local text file on system
  getLocalFile: function (path, name) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', (err, data) => err ? reject(err) : resolve([name, data]))
    })
  },
  // Return Array set of file names
  getLocalFileList: function (path) {
    return new Promise((resolve, reject) => {
      fs.readdir(`${path}`, (err, fileNameList) => err ? reject(err) : resolve(fileNameList))
    })
  },
  // Return file name String
  saveLocalFile: function (path, name, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, content, err => err ? reject(err) : resolve(name))
    })
  },
  // Return file name String
  deleteLocalFile: function (path, name) {
    return new Promise(resolve => fs.unlink(path, () => resolve(name)))
  }
}
