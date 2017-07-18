const assert = require('power-assert')
const model = require('../../app/models')
const File = model.File

describe('file', () => {
  const path = './test/samples/'
  const namesList = ['sample1.txt', 'sample2.txt']
  const sampleFile = namesList[0]
  const sampleContent = 'sample content'

  before(done => {
    namesList.forEach(name => {
      fs.writeFile(path + name, sampleContent, err => {
        if (err) console.log(err)
      })
    })
    done()
  })

  after(done => {
    let existingFiles = []
    fs.readdir(path, (err, list) => err ? console.log(err) : console.log(list))
    console.log(existingFiles)
    existingFiles.forEach(file => fs.unlink(path + file))
    done()
  })

  it('should read a local file', done => {
    const result = getLocalFileContent(path + sampleFile)

    result.then(text => {
      assert(text, sampleContent)
      done()
    }, err => {
      assert.fail(err)
      done()
    })
  })

  it('should returns a list of file names', done => {
    const result = getLocalFileList(path)

    result.then(list => {
      assert.deepEqual(list, namesList)
      done()
    }, err => {
      assert.fail(err)
      done()
    })
  })

  it('should save a local file', done => {
    const savedFile = 'saved.txt'
    const savedContent = 'created by test'
    const result = saveLocalFile(path + savedFile, savedContent)

    result.then(() => {
      fs.readFile(path + savedFile, 'utf-8', (err, text) => {
        if (err) assert.fail(err)
        assert(text === savedContent)
        done()
      })
    }, err => {
      assert.fail(err)
      done()
    })
  })

  it('should remove a local file', done => {
    const result = removeLocalFile(path + sampleFile)

    result.then(() => {
      fs.access(path + sampleFile, err => err ? assert.ok('Success removing') : assert.fail('Failure removing'))
      done()
    }, err => {
      assert.fail(err)
      done()
    })
  })
})
