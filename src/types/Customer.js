import { createModule, gql } from "graphql-modules";
import {
  readCustomer,
  readCustomers,
  updateCustomer,
  createCustomer,
} from "../db_functions/Customer.js";
import { readTokens } from "../db_functions/Token.js";
import { readRedemptions } from "../db_functions/Redemption.js";

const CustomerModule = createModule({
  id: "customer",
  typeDefs: gql`
    type Customer implements User {
      _id: ID!
      name: String!
      phone: ID!
      otp: String
      redemptions: [Redemption!]!
      tokens: [Token!]!
      redemptionCount: Int!
      tokenCount: Int!
    }

    type Query {
      readCustomers: [Customer!]!
      readCustomer(_id: ID, phone: ID): Customer
      totalCustomers: Int
    }

    type Mutation {
      createCustomer(name: String!, phone: String!): HTTPResponse
      updateCustomer(phone: String!, name: String!): HTTPResponse
    }
  `,
  resolvers: {
    Customer: {
      redemptions: (parent) => readRedemptions({customerId: parent._id}),
      tokens: (parent) => readTokens({owners: parent._id}),
      redemptionCount: (parent) => readRedemptions({customerId: parent._id}).then(reds => reds.length),
      tokenCount: (parent) => readTokens({owners: parent._id}).then(tokens => tokens.length)
    },
    Query: {
      readCustomers: () => readCustomers(),
      readCustomer: (_, args) => readCustomer(args),
      totalCustomers: () => readCustomers().then(c => c.length)
    },
    Mutation: {
      createCustomer: (_, args) => createCustomer(args),
      updateCustomer: (_, args) => updateCustomer({ phone: args.phone }, args),
    },
  },
});

export default CustomerModule;