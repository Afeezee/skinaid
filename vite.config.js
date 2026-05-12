import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

import deleteAccountHandler from './api/account/delete.js'
import analyzeHandler from './api/analyze.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createJsonResponse(res) {
  let statusCode = 200

  return {
    status(code) {
      statusCode = code
      res.statusCode = code
      return this
    },
    json(payload) {
      res.statusCode = statusCode
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(payload))
      return this
    },
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []

    req.on('data', (chunk) => {
      chunks.push(chunk)
    })

    req.on('end', () => {
      if (!chunks.length) {
        resolve(undefined)
        return
      }

      const rawBody = Buffer.concat(chunks).toString('utf8')

      if ((req.headers['content-type'] || '').includes('application/json')) {
        try {
          resolve(JSON.parse(rawBody))
        } catch {
          resolve(rawBody)
        }

        return
      }

      resolve(rawBody)
    })

    req.on('error', reject)
  })
}

function localApiBridgePlugin() {
  const routeHandlers = new Map([
    ['/api/analyze', analyzeHandler],
    ['/api/account/delete', deleteAccountHandler],
  ])

  return {
    name: 'local-api-bridge',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url ? req.url.split('?')[0] : ''
        const handler = routeHandlers.get(pathname)

        if (!handler) {
          next()
          return
        }

        try {
          req.body = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')
            ? await readRequestBody(req)
            : undefined

          await handler(req, createJsonResponse(res))
        } catch (error) {
          console.error('Local API bridge error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'Local API bridge error',
              message: error.message,
            }),
          )
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), localApiBridgePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})