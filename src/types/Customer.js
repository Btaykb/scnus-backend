import { createModule, gql } from "graphql-modules";
import {
  readCustomer,
  readCustomers,
  updateCustomer,
  createCustomer,
} from "../db_functions/Customer.js";
import { readNFTs } from "../db_functions/NFT.js";
import { readRedemptions } from "../db_functions/Redemption.js";

const CustomerModule = createModule({
  id: "customer",
  typeDefs: gql`
    type Customer implements User {
      _id: ID!
      name: String!
      phone: ID!
      redemptions: [Redemption!]!
      nfts: [NFT!]!
    }

    type Query {
      getAllCustomers: [Customer!]!
      getCustomer(_id: ID, phone: ID): Customer
    }

    type Mutation {
      createCustomer(name: String!, phone: String!): HTTPResponse
      updateCustomer(phone: String!, name: String!): HTTPResponse
    }
  `,
  resolvers: {
    Customer: {
      redemptions: (parent) => readRedemptions({customerId: parent._id}),
      nfts: (parent) => readNFTs({owners: parent._id})
    },
    Query: {
      getAllCustomers: () => readCustomers(),
      getCustomer: (_, args) => readCustomer(args),
    },
    Mutation: {
      createCustomer: (_, args) => createCustomer(args),
      updateCustomer: (_, args) => updateCustomer({ phone: args.phone }, args),
    },
  },
});

export default CustomerModule;