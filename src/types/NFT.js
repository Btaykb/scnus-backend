import { createModule, gql } from "graphql-modules";
import { createNFT, deleteNFT, readNFT, readNFTs, updateNFT } from "../db_functions/NFT.js";

const NFTModule = createModule({
	id: 'nft',
	typeDefs: gql`
		type NFT {
			_id: ID!
			event: String!
			name: String!
			description: String
			imageURL: String!
			link: String
			owners: [ID!]!
			totalOwners: Int
		}

		type Query {
			getAllNFTs: [NFT!]!
			getNFT(_id: ID!): NFT
		}

		type Mutation {
			createNFT(event: String!, name: String!, description: String, imageURL: String!, link: String): HTTPResponse
			updateNFTDetails(_id: String!, name: String, description: String, imageURL: String, link: String): HTTPResponse
			addOwner(_id: ID!, ownerId: ID!): HTTPResponse
			deleteNFT(_id: ID!): HTTPResponse
		}

	`,
	resolvers: {
		NFT: {
			totalOwners: async (parent) => readNFT(parent).then(n => n.owners.length)
		},
		Query: {
			getAllNFTs: () => readNFTs(),
			getNFT: (_, args) => readNFT(args),
		},
		Mutation: {
			createNFT: (_, args) => createNFT(args),
			updateNFTDetails: (_, args) => updateNFT({_id: args._id}, args),
			addOwner: (_, args) => updateNFT({_id: args._id}, { $addToSet: { owners: args.ownerId }}),
			deleteNFT: (_, args) => deleteNFT(args)
		}
	}
})

export default NFTModule