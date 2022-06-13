import { createModule, gql } from "graphql-modules";
import { createTier, deleteTier, readTier, readTiers, updateTier } from "../db_functions/Tier.js";

const TierModule = createModule({
	id: 'tier',
	typeDefs: gql`
		type Tier {
			_id: ID!
			name: String!
			tokenReq: Int!
			discount: Float!
		}

		type Query {
			readTiers: [Tier!]!
			readTier(name: String!): Tier
		}

		type Mutation {
			createTier(name: String!, tokenReq: Int!, discount: Float!): HTTPResponse
			updateTier(name: String!, tokenReq: Int!, discount: Float!): HTTPResponse
			deleteTier(name: ID!): HTTPResponse
		}

	`,
	resolvers: {
		Query: {
			readTiers: () => readTiers(),
			readTier: (_, args) => readTier(args)
		},
		Mutation: {
			createTier: (_, args) => createTier(args),
			updateTier: (_, args) => updateTier({name: args.name}, args),
			deleteTier: (_, args) => deleteTier(args),
		}
	}
})

export default TierModule