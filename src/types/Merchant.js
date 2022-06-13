import { createModule, gql } from "graphql-modules";
import {
	readMerchant,
	readMerchants,
	updateMerchant,
	createMerchant
  } from "../db_functions/Merchant.js";
import { readRedemptions } from "../db_functions/Redemption.js";

const MerchantModule = createModule({
  id: "merchant",
  typeDefs: gql`
    type Merchant implements User {
      _id: ID!
      name: String!
      phone: ID!
      redemptions: [Redemption!]!
    }

    type Query {
      readMerchants: [Merchant!]!
      readMerchant(_id: ID, phone: ID): Merchant
      totalMerchants: Int
    }

    type Mutation {
      createMerchant(name: String!, phone: String!): HTTPResponse
      updateMerchant(phone: String!, name: String!): HTTPResponse
    }
  `,
  resolvers: {
    Merchant: {
      redemptions: (parent) => readRedemptions({merchantId: parent._id})
    },
    Query: {
      readMerchants: () => readMerchants(),
      readMerchant: (_, args) => readMerchant(args),
      totalMerchants: () => readMerchants().then(m => m.length)
    },
    Mutation: {
      createMerchant: (_, args) => createMerchant(args),
      updateMerchant: (_, args) => updateMerchant({ phone: args.phone }, args),
    },
  },
});

export default MerchantModule;
