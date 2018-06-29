import dotenv from 'dotenv'
import express from 'express'
import sapper from 'sapper'
import serve from 'serve-static'
import compression from 'compression'
import { Store } from 'svelte/store.js'
import { routes } from './manifest/server.js'
import App from './App.html'

dotenv.config()

const app = express()

/* polka() // You can also use Express
  .use(compression({ threshold: 0 }), sirv('assets'), sapper({ routes, App }))
  .listen(process.env.PORT)
  .catch(err => {
    console.log('error', err)
  }) */

app
  .use(
    compression({ threshold: 0 }),
    serve('assets'),
    sapper({
      App,
      routes,
      store: req => {
        return new Store({
          guide_contents: [],
        })
      },
    }),
  )
  .listen(process.env.PORT)
