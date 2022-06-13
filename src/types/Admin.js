import { createModule, gql } from "graphql-modules";
import { createAdmin, readAdmins, readAdmin, updateAdmin, updateAdminOTP } from "../db_functions/Admin.js";

const AdminModule = createModule({
	id: 'admin',
	typeDefs: gql`
		type Admin implements User {
			_id: ID!
			name: String!
			phone: ID!
			otp: String
		}

		type Query {
			readAdmins: [Admin!]!
			readAdmin(_id: ID, phone: ID): Admin
			isAdmin(phone: ID!): Boolean
		}

		type Mutation {
			createAdmin(name: String!, phone: String!): HTTPResponse
			updateAdmin(phone: String!, name: String!): HTTPResponse
			updateAdminOTP(phone: String!): HTTPResponse
		}

	`,
	resolvers: {
		Query: {
			readAdmins: () => readAdmins(),
			readAdmin: (_, args) => readAdmin(args),
			isAdmin: (_, args) => readAdmin(args).then(x => !!x)
		},
		Mutation: {
			createAdmin: (_, args) => createAdmin(args),
			updateAdmin: (_, args) => updateAdmin({ phone: args.phone }, args),
			updateAdminOTP: (_, args) => updateAdminOTP(args)
		}
	}
})

export default AdminModule