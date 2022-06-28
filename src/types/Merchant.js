import { createModule, gql } from "graphql-modules";
import {
	readMerchant,
	readMerchants,
	updateMerchant,
	createMerchant,
  updateMerchantOTP
  } from "../db_functions/Merchant.js";
import { readRedemptions } from "../db_functions/Redemption.js";
import jwt from 'jsonwebtoken'
import { JWT_SIGN_KEY, TIERS } from "../utils/constants.js";
import { readCustomer } from "../db_functions/Customer.js";
import { readTokens } from "../db_functions/Token.js";
import isToday from "../utils/isToday.js";

const parseReward = (token) => {
  try {
    const res = jwt.verify(token, JWT_SIGN_KEY)
    return { _id: res._id, iat: res.iat }
  } catch (error) {
    return { _id: null, iat: null}
  }
}

const MerchantModule = createModule({
  id: "merchant",
  typeDefs: gql`
    type Merchant implements User {
      _id: ID!
      name: String!
      phone: ID!
      otp: String
      redemptions: [Redemption!]!
      discountToday: Float!
      discount: Float
    }

    type Query {
      readMerchants: [Merchant!]!
      readMerchant(_id: ID, phone: ID): Merchant
      totalMerchants: Int
    }

    type Mutation {
      createMerchant(name: String!, phone: String!): HTTPResponse
      updateMerchant(phone: String!, name: String!): HTTPResponse
      updateMerchantOTP(phone: String!): HTTPResponse
      verifyReward(token: String!): HTTPResponse
    }
  `,
  resolvers: {
    Merchant: {
      redemptions: (parent) => readRedemptions({merchantId: parent._id}),
      discountToday: (parent) => readRedemptions({merchantId: parent._id}).then(res => res.filter(r => isToday(r.time))).then(res => res.reduce((x, y) => x + y.discount, 0)),
      discount: (parent) => readRedemptions({merchantId: parent._id}).then(res => res.reduce((x, y) => x + y.discount, 0))
    },
    Query: {
      readMerchants: () => readMerchants(),
      readMerchant: (_, args) => readMerchant(args),
      totalMerchants: () => readMerchants().then(m => m.length)
    },
    Mutation: {
      createMerchant: (_, args) => createMerchant(args),
      updateMerchant: (_, args) => updateMerchant({ phone: args.phone }, args),
      updateMerchantOTP: (_, args) => updateMerchantOTP(args),
      verifyReward: async (_, args) => {
        const { token } = args
        const { _id, iat } = parseReward(token)
        console.log(token)
        const customer = await readCustomer({ _id: _id})
        if (!customer) return { error: 'Customer not found.'}
        const tokenCount = await readTokens( { owners: _id }).then(tokens => tokens.length)
        const tier = TIERS.filter(t => t.tokenReq <= tokenCount).reverse()[0]
        return { response: `${_id}-${tier.discount}` }
      }
    },
  },
});

export default MerchantModule;
