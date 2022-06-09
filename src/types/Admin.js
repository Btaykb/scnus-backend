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
			getAllAdmins: [Admin!]!
			getAdmin(_id: ID, phone: ID): Admin
		}

		type Mutation {
			createAdmin(name: String!, phone: String!): HTTPResponse
			updateAdmin(queryPhone: String!, name: String!): HTTPResponse
		}

	`,
	resolvers: {
		Query: {
			getAllAdmins: () => readAdmins(),
			getAdmin: (_, args) => readAdmin(args)
		},
		Mutation: {
			createAdmin: (_, args) => createAdmin(args),
			updateAdmin: (_, args) => updateAdmin({ phone: args.queryPhone }, { name: args.name })
		}
	}
})

export default AdminModule