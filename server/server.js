import Fastify from 'fastify'
import axios from 'axios'
import cors from '@fastify/cors'

const fastify = Fastify({})
await fastify.register(cors, {
  origin: (origin, cb) => {
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
    // eslint-disable-next-line no-console
    console.log(`Fetch OWM data (lat=${request.query.lat},lon=${request.query.lon})`)
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
    // eslint-disable-next-line no-console
    console.log(`Fetch NASA APOD data (date=${new Date()})`)
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
    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        'q': request.query.q,
        'format': 'json',
        'accept-language': 'fr',
        'limit': 5,
      },
    }) // eslint-disable-next-line no-console
    console.log(`Fetch OSM data (q=${request.query.q})`)
    return data
  }
  catch (e) {
    return { error: true, details: e.message }
  }
})
// fastify.get('/api/wiki/qotd', async () => {
//   try {
//     const { data } = await axios.get('https://fr.wikiquote.org/wiki/Wikiquote:Accueil', {
//       headers: { 'content-type': 'application/json' },
//     })
//     // eslint-disable-next-line no-console
//     console.log(`Fetch NASA APOD data (date=${new Date()})`)
//     return data
//   }
//   catch (e) {
//     return { error: true, details: e.message }
//   }
// })

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
