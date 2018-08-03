import fs from 'fs'
import path from 'path'
import * as fleece from 'golden-fleece'
import processMarkdown from '../_processMarkdown'
import marked from 'marked'
import cheerio from 'cheerio'
import Prism from 'prismjs'
import classNameUtils from '../_classNameUtils'
import escape from '../_escape'
import '../_processLineNumbers'

const escaped = {
  '"': '&quot;',
  "'": '&#39;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

const unescaped = Object.keys(escaped).reduce(
  (unescaped, key) => ((unescaped[escaped[key]] = key), unescaped),
  {},
)

function unescape(str) {
  return String(str).replace(/&.+?;/g, match => unescaped[match] || match)
}

function replaceTag(tag) {
  return escaped[tag] || tag
}

const blockTypes = 'blockquote html heading hr list listitem paragraph table tablerow tablecell'.split(
  ' ',
)

function extractMeta(line, lang) {
  try {
    if (lang === 'html' && line.startsWith('<!--') && line.endsWith('-->')) {
      return fleece.evaluate(line.slice(4, -3).trim())
    }

    if (
      lang === 'js' ||
      (lang === 'json' && line.startsWith('/*') && line.endsWith('*/'))
    ) {
      return fleece.evaluate(line.slice(2, -2).trim())
    }
  } catch (err) {
    // TODO report these errors, don't just squelch them
    return null
  }
}

// https://github.com/darkskyapp/string-hash/blob/master/index.js
function getHash(str) {
  let hash = 5381
  let i = str.length

  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i)
  return (hash >>> 0).toString(36)
}

const cheerioOption = {
  decodeEntities: false,
}

const SELECTOR = 'pre>code[class*="language-"]'

export const demos = new Map()

export default function() {
  return fs
    .readdirSync(`content/guide`)
    .filter(file => file[0] !== '.' && path.extname(file) === '.md')
    .map(file => {
      const markdown = fs.readFileSync(`content/guide/${file}`, 'utf-8')

      const { content, metadata } = processMarkdown(markdown)

      const groups = []
      let group = null
      let uid = 1

      const renderer = new marked.Renderer()

      renderer.code = (source, lang) => {
        source = source.replace(/^ +/gm, match =>
          match.split('    ').join('\t'),
        )

        const lines = source.split('\n')

        const meta = extractMeta(lines[0], lang)

        let prefix = ''
        let className = 'code-block'

        if (lang === 'html' && !group) {
          if (!meta || meta.repl !== false) {
            prefix = `<a class='open-in-repl' href='repl?demo=@@${uid}'>REPL</a>`
          }

          group = { id: uid++, blocks: [] }
          groups.push(group)
        }

        if (meta) {
          source = lines.slice(1).join('\n')
          const filename = meta.filename || (lang === 'html' && 'App.html')
          if (filename) {
            prefix = `<span class='filename'>${prefix} ${filename}</span>`
            className += ' named'
          }
        }

        if (group) group.blocks.push({ meta: meta || {}, lang, source })

        if (meta && meta.hidden) return ''

        // Start Code highlight with Prism

        // Define proper language type from `lang` param
        const properLanguage =
          (lang === 'js' ? 'javascript' : lang) || 'markdown'

        // Create a inline code tag
        const html = `<pre class="code-block line-numbers language-${properLanguage}"><code class="language-${properLanguage}">${source.replace(
          /[&<>]/g,
          replaceTag,
        )}</code></pre>`

        // Load cheerio with Code component output
        const $ = cheerio.load(html, cheerioOption)

        // Select element with cheerio
        const $elements = $(SELECTOR)

        // Default options for Prism
        const options = {
          languages: ['bash', 'markup', 'markdown', 'javascript', 'css'],
          fontSize: 16,
        }

        // Import language support of every souce code block
        if ($elements.length !== 0) {
          options.languages.forEach(language =>
            require(`prismjs/components/prism-${language}`),
          )
        }

        // Apply Prism js to every source code
        $elements.each(function(index, element) {
          let $element = $(this)

          let $parent = $element.parent()

          let language = classNameUtils.getLanguageFromClassName(
            $element.attr('class'),
          )

          let grammar = Prism.languages[language]

          $parent
            .addClass(`language-${language}`)
            .css('font-size', options.fontSize + 'px')

          let code = $element.html()

          // &amp; -> &
          code = escape.amp(code)
          // &lt; -> '<', &gt; -> '>'
          code = escape.tag(code)

          let env = {
            $element: $element,
            language: language,
            grammar: grammar,
            code: code,
            options: options,
          }

          Prism.hooks.run('before-sanity-check', env)

          if (!env.code || !env.grammar) {
            if (env.code) {
              env.element.textContent = env.code
            }
            Prism.hooks.run('complete', env)
            return
          }

          Prism.hooks.run('before-highlight', env)

          let highlightedCode = Prism.highlight(code, grammar)

          env.highlightedCode = highlightedCode
          Prism.hooks.run('before-insert', env)

          $element.text(highlightedCode)

          Prism.hooks.run('after-highlight', env)
          Prism.hooks.run('complete', env)
        })

        return `<div class='${className} code-block-container'>${prefix}${$.html()}</div>`
      }

      blockTypes.forEach(type => {
        const fn = renderer[type]
        renderer[type] = function() {
          group = null
          return fn.apply(this, arguments)
        }
      })

      const html = marked(content, { renderer })

      const hashes = {}

      groups.forEach(group => {
        const main = group.blocks[0]
        if (main.meta.repl === false) return

        const hash = getHash(group.blocks.map(block => block.source).join(''))
        hashes[group.id] = hash

        const json5 = group.blocks.find(block => block.lang === 'json')

        const title = main.meta.title
        if (!title) console.error(`Missing title for demo in ${file}`)

        demos.set(
          hash,
          JSON.stringify({
            title: title || 'Example from guide',
            components: group.blocks
              .filter(block => block.lang === 'html' || block.lang === 'js')
              .map(block => {
                const [name, type] = (block.meta.filename || '').split('.')
                return {
                  name: name || 'App',
                  type: type || 'html',
                  source: block.source,
                }
              }),
            json5: json5 && json5.source,
          }),
        )
      })

      const subsections = []
      let pattern = /<h2 id="(.+?)">(.+?)<\/h2>/g
      let match

      while ((match = pattern.exec(html))) {
        const slug = match[1]
        const title = unescape(
          match[2]
            .replace(/<\/?code>/g, '')
            .replace(/\.(\w+)(\((.+)?\))?/, (m, $1, $2, $3) => {
              if ($3) return `.${$1}(...)`
              if ($2) return `.${$1}()`
              return `.${$1}`
            }),
        )

        subsections.push({ slug, title })
      }

      let output = html.replace(/<h3 id=".+?">(\d\.).+?<\/h3>/g, (m, $1) => {
        return m.replace($1, `<span class="counter">${$1}</span>`)
      })

      return {
        html: output.replace(/@@(\d+)/g, (m, id) => hashes[id] || m),
        metadata,
        subsections,
        slug: file.replace(/^\d+-/, '').replace(/\.md$/, ''),
        file,
      }
    })
}
