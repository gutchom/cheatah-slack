const AWS = require('aws-sdk')
const rootDirectory = 'cheatah-slack'
const Bucket = 'suw-arakawa'
const ACL = 'private'

const s3 = new AWS.S3()

function pathBuilder(name, team, scope) {
  const path = [rootDirectory, team, scope, encodeURIComponent(name)]
  return path.filter(element => element && element.length > 0).join('/')
}

function downloadTextFile(path) {
  return new Promise((resolve, reject) => {
    s3.getObject({ Bucket, Key: path }, (err, data) => err ? reject(err) : resolve(data))
  })
}

function uploadTextFile(path, content) {
  const params = {
    Bucket,
    ACL,
    Key: path,
    Body: content,
    ContentType: 'text/plain',
  }

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => err ? reject(err) : resolve(true))
  })
}

function deleteFile(path) {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket, Key: path }, (err, data) => err ? reject(err) : resolve(true))
  })
}

module.exports = {
  pathBuilder,
  downloadTextFile,
  uploadTextFile,
  deleteFile,
}
