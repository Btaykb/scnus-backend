import { createModule, gql } from "graphql-modules";
import { createAdmin, readAdmins, readAdmin, updateAdmin } from "../db_functions/Admin.js";

const AdminModule = createModule({
	id: 'admin',
	typeDefs: gql`
		type Admin implements User {
			_id: ID!
			name: String!
			phone: ID!
		}

		type Query {
			readAdmins: [Admin!]!
			readAdmin(_id: ID, phone: ID): Admin
		}

		type Mutation {
			createAdmin(name: String!, phone: String!): HTTPResponse
			updateAdmin(phone: String!, name: String!): HTTPResponse
		}

	`,
	resolvers: {
		Query: {
			readAdmins: () => readAdmins(),
			readAdmin: (_, args) => readAdmin(args)
		},
		Mutation: {
			createAdmin: (_, args) => createAdmin(args),
			updateAdmin: (_, args) => updateAdmin({ phone: args.phone }, args)
		}
	}
})

export default AdminModule