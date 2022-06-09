import { createModule, gql } from "graphql-modules";
import { createRedemption, readRedemption, readRedemptions } from "../db_functions/Redemption.js";

const RedemptionModule = createModule({
	id: 'redemption',
	typeDefs: gql`
		type Redemption {
			_id: ID!
			vendor_id: String!
			customer_id: String!
			amount: Float!
			discount: Float!
			time: String!
		}

		type Query {
			getAllRedemptions: [Redemption!]!
			getRedemption(_id: ID!): Redemption
		}

		type Mutation {
			createRedemption(vendor_id: String!, customer_id: String!, amount: Float!, discount: Float!): HTTPResponse
		}

	`,
	resolvers: {
		Query: {
			getAllRedemptions: () => readRedemptions(),
			getRedemption: (_, args) => readRedemption(args._id)
		},
		Mutation: {
			createRedemption: (_, args) => createRedemption(args),
		}
	}
})

export default RedemptionModule