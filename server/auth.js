import process from 'node:process'
import bcrypt from 'bcrypt'

export async function authorizationMiddleware(req, reply, fastify) {
  const { headers: { authorization }, routeOptions } = req

  if (!routeOptions.url.includes('/secure/')) {
    fastify.log.info(`Public route accessed`)
    return
  }
  if (!authorization) {
    return reply.code(403).send({ error: 'No authorization header found.' })
  }
  // Check if the user is allowed to perform the action on the resource
  const allowed = await bcrypt.compareSync(process.env.SECRET, authorization)

  // If the user is not allowed, return a 403
  if (!allowed) {
    fastify.log.info(`Access forbidden for user ${req.remoteAddress}`)
    return reply.code(403).send({ error: 'Forbidden' })
  }
  else {
    fastify.log.info(`Access granted for user ${req.remoteAddress}`)
  }
}
