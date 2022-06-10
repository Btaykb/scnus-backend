import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'

const model = mongoose.model
const Schema = mongoose.Schema
const schemaTypes = Schema.Types

const NFTSchema = Schema({
	event: { type: schemaTypes.String, required: true },
	name: { type: schemaTypes.String, required: true },
	description: { type: schemaTypes.String, required: false },
	imageURL: { type: schemaTypes.String, required: true },
	link: { type: schemaTypes.String, required: false },
	owners: { type: [schemaTypes.String], required: true, default: [] },
})

export const NFTObject = model('NFT', NFTSchema)

export const createNFT = async (nft) => {
	const httpResponse = new NFTObject(nft).save()
		.then(res => {
			console.log(`New NFT created with id ${res._id}`)
			return { response: res._id }
		})
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
	return httpResponse
}

export const readNFT = (params) => {
	return NFTObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => {
			console.log('Error while getting NFT: DB error')
		})
}

export const readNFTs = (params) => {
	return NFTObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => {
			console.log('Error while getting NFTs: DB error')
		})
}

export const updateNFT = (query, update) => {
	return NFTObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => {
			console.log(`NFT with id ${res._id} updated`)
			return { response: res._id }
		})
		.catch(err => {
			console.log('Error while updating NFT: DB error')
			return { error: err.code ? err.code : err }
		})
}

export const deleteNFT = (query) => {
	return NFTObject.findOneAndDelete(query)
		.then(res => {
			console.log(`NFT with id ${res._id} deleted`)
			return { response: "Deletion completed." }
		})
		.catch(err => {
			console.log('Error while deleting NFT: DB error')
			return { error: err.code ? err.code : err }
		})
}