import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import http from 'http'
import { apolloApplication } from './apolloApplication.js'
import jwt from 'jsonwebtoken'
import { JWT_SIGN_KEY } from './utils/constants.js'

const schema = apolloApplication.createSchemaForApollo()
const PORT = process.env.PORT || 4000;

const whitelisted = ["IntrospectionQuery", "CreateAdmin", "CreateCustomer", "CreateMerchant"]

export const getUserFromJwt = (token) => {
	try {
		return jwt.verify(token, JWT_SIGN_KEY)
	} catch (error) {
		return {}
	}
}

const apolloContext = async ({ req }) => {
	if (req.body.operationName !== 'IntrospectionQuery') console.log(req.body.operationName)
	if (whitelisted.includes(req.body.operationName)) return {}
	const token = req.headers.authorization || 'Bearer null'
	if (!token.includes('Bearer ')) throw new AuthenticationError('Token must use Bearer format')
	const user = getUserFromJwt(token.split(' ')[1])
	if (!user) throw new AuthenticationError('Must be logged in to use this query/mutation/subscription.')
	return user
}

export default async function startApolloServer() {
	const app = express()
	const httpServer = http.createServer(app)
	const apolloServer = new ApolloServer({
		schema,
		csrfPrevention: true,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
		context: apolloContext
	})
	await apolloServer.start()
	apolloServer.applyMiddleware({
		app,
		path: '/'
	})
	await new Promise((resolve) => httpServer.listen( { port: PORT }, resolve))
	console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
}