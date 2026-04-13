import type { IncomingMessage, ServerResponse } from 'node:http'

import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import chatHandler from './api/chat'

function readNodeRequestBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'))
    })

    req.on('error', reject)
  })
}

function toRequestHeaders(req: IncomingMessage) {
  const headers = new Headers()

  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') {
      headers.set(key, value)
      continue
    }

    if (Array.isArray(value)) {
      headers.set(key, value.join(', '))
    }
  }

  return headers
}

async function writeFetchResponse(res: ServerResponse, response: Response) {
  res.statusCode = response.status

  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  if (!response.body) {
    res.end()
    return
  }

  const reader = response.body.getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      res.write(Buffer.from(value))
    }
  } finally {
    reader.releaseLock()
    res.end()
  }
}

function devChatApiPlugin(): Plugin {
  return {
    name: 'dev-chat-api-middleware',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        try {
          const method = req.method ?? 'GET'
          const headers = toRequestHeaders(req)
          const origin = `http://${req.headers.host ?? 'localhost:5173'}`

          const body =
            method === 'GET' || method === 'HEAD' ? undefined : await readNodeRequestBody(req)

          const response = await chatHandler(
            new Request(`${origin}/api/chat`, {
              method,
              headers,
              body,
            }),
          )

          await writeFetchResponse(res, response)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (env.GOOGLE_API_KEY) {
    process.env.GOOGLE_API_KEY = env.GOOGLE_API_KEY
  }

  return {
    plugins: [devChatApiPlugin(), react(), tailwindcss()],
  }
})
