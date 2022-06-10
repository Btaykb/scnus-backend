import { createModule, gql } from "graphql-modules";
import { createRedemption, readRedemption, readRedemptions } from "../db_functions/Redemption.js";

const RedemptionModule = createModule({
	id: 'redemption',
	typeDefs: gql`
		type Redemption {
			_id: ID!
			merchantId: String!
			customerId: String!
			amount: Float!
			discount: Float!
			time: String!
		}

		type Query {
			getAllRedemptions: [Redemption!]!
			getRedemption(_id: ID!): Redemption
			totalRedemptions: Int
			totalDiscount: Float
		}

		type Mutation {
			createRedemption(merchantId: String!, customerId: String!, amount: Float!, discount: Float!): HTTPResponse
		}

	`,
	resolvers: {
		Query: {
			getAllRedemptions: () => readRedemptions(),
			getRedemption: (_, args) => readRedemption(args),
			totalRedemptions: () => readRedemptions().then(r => r.length),
			totalDiscount: () => readRedemptions().then(r => r.map(r => r.discount).reduce((a,b) => a + b, 0))
		},
		Mutation: {
			createRedemption: (_, args) => createRedemption(args),
		}
	}
})

export default RedemptionModule