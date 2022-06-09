import { createModule, gql } from "graphql-modules";
import {
	readMerchant,
	readMerchants,
	updateMerchant,
	createMerchant
  } from "../db_functions/Merchant.js";

const MerchantModule = createModule({
  id: "merchant",
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

    type Mutation {
      createMerchant(name: String!, phone: String!): HTTPResponse
      updateMerchant(queryPhone: String!, name: String!): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      getAllMerchants: () => readMerchants(),
      getMerchant: (_, args) => readMerchant(args),
    },
    Mutation: {
      createMerchant: (_, args) => createMerchant(args),
      updateMerchant: (_, args) =>
        updateMerchant({ phone: args.queryPhone }, { name: args.name }),
    },
  },
});

export default MerchantModule;
