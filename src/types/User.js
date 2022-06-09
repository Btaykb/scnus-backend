import { createModule, gql } from "graphql-modules";

const UserModule = createModule({
	id: 'user',
	typeDefs: gql`
		interface User {
			_id: ID!
			name: String!
			phone: ID!
		}
	`
})

export default UserModule