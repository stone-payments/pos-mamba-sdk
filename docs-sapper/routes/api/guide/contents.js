import getSections from './_sections.js'

let json

export function get(req, res) {
  if (!json || process.env.NODE_ENV !== 'production') {
    json = JSON.stringify(
      getSections().map(section => {
        return {
          metadata: section.metadata,
          subsections: section.subsections,
          slug: section.slug,
        }
      }),
    )
  }

  res.set({
    'Content-Type': 'application/json',
  })

  res.end(json)
}
