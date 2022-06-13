import { createModule, gql } from "graphql-modules";
import { createToken, deleteToken, readToken, readTokens, updateToken } from "../db_functions/Token.js";

const TokenModule = createModule({
	id: 'token',
	typeDefs: gql`
		type Token {
			_id: ID!
			event: String!
			name: String!
			description: String
			imageURL: String!
			link: String
			owners: [ID!]!
			ownerCount: Int
		}

		type Query {
			readTokens: [Token!]!
			readToken(_id: ID!): Token
		}

		type Mutation {
			createToken(event: String!, name: String!, description: String, imageURL: String!, link: String): HTTPResponse
			updateToken(_id: String!, name: String, description: String, imageURL: String, link: String): HTTPResponse
			addTokenOwner(_id: ID!, ownerId: ID!): HTTPResponse
			deleteToken(_id: ID!): HTTPResponse
		}

	`,
	resolvers: {
		Token: {
			ownerCount: async (parent) => readToken(parent).then(n => n.owners.length)
		},
		Query: {
			readTokens: () => readTokens(),
			readToken: (_, args) => readToken(args),
		},
		Mutation: {
			createToken: (_, args) => createToken(args),
			updateToken: (_, args) => updateToken({_id: args._id}, args),
			addTokenOwner: (_, args) => updateToken({_id: args._id}, { $addToSet: { owners: args.ownerId }}),
			deleteToken: (_, args) => deleteToken(args)
		}
	}
})

export default TokenModule