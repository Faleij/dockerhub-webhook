'use strict'

const pathJoin = require('path').join
const fileExists = require('file-exists').sync
const exec = require('child_process').exec

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      throw Error('Missing required input: options')
    }
    if (!options.script) {
      throw Error('Missing required input: options.script')
    }
    const scriptsPath = pathJoin(__dirname, '../scripts/')
    const script = options.script
    if (script instanceof Function) {
      // whatever script returns, wrap it in a promise so that it
      // may return a promise and we will wait for it to resolve
      const promise = new Promise((resolve) => resolve(script(options.pushData)))
      promise.then(
        result => resolve(Object.assign(options, { description: String(result).substring(0, 200) })),
        err => resolve(Object.assign(options, {
          state: 'error',
          description: err.message
        }))
      )
      return
    }
    if (!script) return resolve(options)
    const filePath = scriptsPath + script.split(' ')[0]
    if (!fileExists(filePath)) {
      throw Error(`File: ${filePath} does not exist`)
    }
    exec(scriptsPath + script, (err, stdout, stderr) => {
      if (err || stderr) {
        options.state = 'error'
      }
      const result = stderr || stdout
      options.description = result ? result.substring(0, 200) : 'Empty result'
      return resolve(options)
    })
  })
}
