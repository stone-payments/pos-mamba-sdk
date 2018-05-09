import { resolve, dirname } from 'path'
import { readFileSync } from 'fs'
import sass from 'node-sass'

const { fromWorkspace } = require('../utils/paths.js')

export default {
  /** Support <script src=""></script> */
  script: ({ content = '', attributes, filename }) => {
    if (attributes.src) {
      const styleFilename = resolve(dirname(filename), attributes.src)
      content = readFileSync(styleFilename).toString()
    }

    return { code: content }
  },
  /** Support <style src=""></style> and SCSS */
  style: ({ content = '', attributes, filename }) => {
    if (attributes.src) {
      const styleFilename = resolve(dirname(filename), attributes.src)
      content = readFileSync(styleFilename).toString()
    }

    const type = (attributes.type || attributes.lang || 'text/css').replace(
      'text/',
      '',
    )

    if (type === 'scss') {
      return new Promise((resolve, reject) => {
        sass.render(
          {
            data: content,
            includePaths: [fromWorkspace('src'), fromWorkspace('node_modules')],
            sourceMap: true,
            outFile: filename + '.css', // Needed node-sass property
          },
          (err, result) => {
            if (err) return reject(err)

            resolve({
              code: result.css.toString(),
              map: result.map.toString(),
            })
          },
        )
      })
    }
  },
}
