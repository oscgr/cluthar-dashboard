import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import Fastify from 'fastify'
import axios from 'axios'
import rateLimit from '@fastify/rate-limit'
import staticFiles from '@fastify/static'
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true,
})

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

await fastify.register(cors, {
  origin: (origin, cb) => {
    if (!origin) {
      cb(null, true)
      return
    }
    const hostname = new URL(origin).hostname
    if (hostname === 'localhost') {
      //  Request from localhost will pass
      cb(null, true)
      return
    }
    // Generate an error on other origins, disabling access
    cb(new Error('Not allowed'), false)
  },
})

fastify.register(staticFiles, {
  root: join(dirname(fileURLToPath(import.meta.url)), '../www'),
})

fastify.get('/', (req, reply) => {
  reply.sendFile('index.html')
})

fastify.get('/api/weather', async (request) => {
  try {
    if (!request.query.lat || !request.query.lon)
      throw new Error('Please provide both "lat" and "lon" query params')
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
      params: {
        lang: 'fr',
        units: 'metric',
        appid: process.env.OPEN_WEATHER_API_KEY,
        ...request.query,
      },
    })
    fastify.log.info(`Fetch OWM data (lat=${request.query.lat},lon=${request.query.lon})`)
    return data
  }
  catch (e) {
    return { error: true, details: e.message }
  }
})

fastify.get('/api/nasa', async () => {
  try {
    const { data } = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: {
        api_key: process.env.NASA_API_KEY,
      },
    })
    fastify.log.info(`Fetch NASA APOD data (date=${new Date()})`)
    return data
  }
  catch (e) {
    return { error: true, details: e.message }
  }
})

fastify.get('/api/geo', async (request) => {
  try {
    if (!request.query.q)
      throw new Error('Please provide "q" query param')
    const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: request.query.q,
        format: 'json',
        language: 'fr',
        count: 5,
      },
    })
    fastify.log.info(`Fetch geocoding data (q=${request.query.q})`)
    return data.results
  }
  catch (e) {
    return { error: true, details: e.message }
  }
})
fastify.get('/api/cocktail', async () => {
  try {
    const { data } = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php', {
      headers: { 'content-type': 'application/json' },
    })
    fastify.log.info(`Fetch random cocktail (date=${new Date()})`)
    return data?.drinks?.[0]
  }
  catch (e) {
    return { error: true, details: e.message }
  }
})

/**
 * Run the server!
 */
async function start() {
  try {
    await fastify.listen({ port: Number(process.env.VITE_SERVER_PORT) || 8080 })
  }
  catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
