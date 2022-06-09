import { createModule, gql } from "graphql-modules";
import { createNFT, readNFT, readNFTs, updateNFT } from "../db_functions/NFT.js";
import deleteKey from '../utils/deleteKey.js'

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
		}

		type Query {
			getAllNFTs: [NFT!]!
			getNFT(_id: ID!): NFT
		}

		type Mutation {
			createNFT(event: String!, name: String!, description: String, imageURL: String!, link: String): HTTPResponse
			updateNFTDetails(queryId: String!, name: String, description: String, imageURL: String, link: String): HTTPResponse
			deleteNFT(_id: ID!): HTTPResponse
			addOwner(_id: ID!, ownerId: ID!): HTTPResponse
		}

	`,
	resolvers: {
		Query: {
			getAllNFTs: () => readNFTs(),
			getNFT: (_, args) => readNFT(args._id)
		},
		Mutation: {
			createNFT: (_, args) => createNFT(args),
			updateNFTDetails: (_, args) => updateNFT(args.queryId, deleteKey(args, ['queryId'])),
			deleteNFT: (_, args) => console.log('delete nft'),
			addOwner: (_, args) => updateNFT(args._id, { $addToSet: { owners: args.ownerId }})
		}
	}
})

export default NFTModule