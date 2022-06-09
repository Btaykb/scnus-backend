import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import http, { Server } from 'http'
import { apolloApplication } from './apolloApplication.js'

const schema = apolloApplication.createSchemaForApollo()

const apolloContext = async ({ req }) => {
	if (req.body.operationName === "IntrospectionQuery") return {}
	console.log(req.body.operationName)
	return {}
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
	await new Promise((resolve) => httpServer.listen( { port: 4000 }, resolve))
	console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
}