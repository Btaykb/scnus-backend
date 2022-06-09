import { createModule, gql } from "graphql-modules";

const CustomerModule = createModule({
	id: 'customer',
	typeDefs: gql`
		type Customer implements User {
			_id: ID!
			name: String!
			phone: ID!
		}

		type Query {
			getAllCustomers: [Customer!]!
			getCustomer(_id: ID, phone: ID): Customer
		}
	`,
	resolvers: {
		Query: {
			getAllCustomers: () => [],
			getCustomer: () => null
		}
	}
})

export default CustomerModule