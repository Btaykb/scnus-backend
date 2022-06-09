import connectToMongo from "./mongoServer.js";
import startApolloServer from "./apolloServer.js";

connectToMongo(startApolloServer)