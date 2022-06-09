import { createModule, gql } from "graphql-modules";

const MerchantModule = createModule({
	id: 'merchant',
	typeDefs: gql`
		type Merchant implements User {
			_id: ID!
			name: String!
			phone: ID!
		}

		type Query {
			getAllMerchants: [Merchant!]!
			getMerchant(_id: ID, phone: ID): Merchant
		}
	`,
	resolvers: {
		Query: {
			getAllMerchants: () => [],
			getMerchant: () => null
		}
	}
})

export default MerchantModule