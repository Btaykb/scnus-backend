import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'

const model = mongoose.model
const Schema = mongoose.Schema
const schemaTypes = Schema.Types

const TokenSchema = Schema({
	event: { type: schemaTypes.String, required: true },
	name: { type: schemaTypes.String, required: true },
	description: { type: schemaTypes.String, required: false },
	imageURL: { type: schemaTypes.String, required: true },
	link: { type: schemaTypes.String, required: false },
	owners: { type: [schemaTypes.String], required: true, default: [] },
})

export const TokenObject = model('Token', TokenSchema)

export const createToken = async (nft) => {
	const httpResponse = new TokenObject(nft).save()
		.then(res => {
			console.log(`New token created with id ${res._id}`)
			return { response: res._id }
		})
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
	return httpResponse
}

export const readToken = (params) => {
	return Object.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => {
			console.log('Error while getting token: DB error')
		})
}

export const readTokens = (params) => {
	return TokenObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => {
			console.log('Error while getting tokens: DB error')
		})
}

export const updateToken = (query, update) => {
	return TokenObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => {
			console.log(`Token with id ${res._id} updated`)
			return { response: res._id }
		})
		.catch(err => {
			console.log('Error while updating token: DB error')
			return { error: err.code ? err.code : err }
		})
}

export const deleteToken = (query) => {
	return TokenObject.findOneAndDelete(query)
		.then(res => {
			console.log(`Token with id ${res._id} deleted`)
			return { response: "Deletion completed." }
		})
		.catch(err => {
			console.log('Error while deleting token: DB error')
			return { error: err.code ? err.code : err }
		})
}