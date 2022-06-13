import { createModule, gql } from "graphql-modules";
import { readAdmin } from "../db_functions/Admin.js";
import { readCustomer } from "../db_functions/Customer.js";
import { readMerchant } from "../db_functions/Merchant.js";
import { JWT_SIGN_KEY } from "../utils/constants.js";
import jwt from 'jsonwebtoken'

const UserModule = createModule({
	id: 'user',
	typeDefs: gql`
		interface User {
			_id: ID!
			name: String!
			phone: ID!
			otp: String
		}

		type Query {
			currentUser: User
		}

		type Mutation {
			login(phone: ID!, otp: String!): HTTPResponse
		}
	`,
	resolvers: {
		User: {
			__resolveType: (_, context) => context.__resolveType
		},
		Query: {
			currentUser: async (_, __, context) => {
				var user = await readCustomer({_id:context._id})
				if (!user) user = await readMerchant({_id:context._id})
				if (!user) user = await readAdmin({_id:context._id})
				return user
			}
		},
		Mutation: {
			login: async (_, args) => {
				var user = await readCustomer({phone:args.phone})
				var resType = 'Customer'
				if (!user) {
					user = await readMerchant({phone:args.phone})
					resType = 'Merchant'
				}
				if (!user) {
					user = await readAdmin({phone:args.phone})
					resType= 'Admin'
				} 
				if (!user) return { error: "Invalid user login details"}
				if (args.otp !== user.otp) return { error: "OTP incorrect"}
				const token = jwt.sign({ _id: user._id, phone: user.phone, __resolveType: resType }, JWT_SIGN_KEY)
				return { response: token }
			}
		}
	}
})

export default UserModule