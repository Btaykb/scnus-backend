import { createModule, gql } from "graphql-modules";
import {
  readCustomer,
  readCustomers,
  updateCustomer,
  createCustomer,
} from "../db_functions/Customer.js";
import deleteKey from "../utils/deleteKey.js";

const CustomerModule = createModule({
  id: "customer",
  typeDefs: gql`
    type Customer implements User {
      _id: ID!
      name: String!
      phone: ID!
    }

    type Query {
      getAllCustomers: [Customer!]!
      getCustomer(_id: ID, phone: ID): Customer
    }

    type Mutation {
      createCustomer(name: String!, phone: String!): HTTPResponse
      updateCustomer(queryPhone: String!, name: String!): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      getAllCustomers: () => readCustomers(),
      getCustomer: (_, args) => readCustomer(args),
    },
    Mutation: {
      createCustomer: (_, args) => createCustomer(args),
      updateCustomer: (_, args) =>
        updateCustomer({ phone: args.queryPhone }, deleteKey(args, ['queryPhone'])),
    },
  },
});

export default CustomerModule;
