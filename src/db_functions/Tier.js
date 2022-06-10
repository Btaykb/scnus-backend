import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const model = mongoose.model
const Schema = mongoose.Schema
const schemaTypes = Schema.Types

const TierSchema = Schema({
	name: { type: schemaTypes.String, required: true, unique: true },
	tokenReq: { type: schemaTypes.Number, required: true, unique: true },
	discount: { type: schemaTypes.Number, required: true }
})

TierSchema.plugin(uniqueValidator)

export const TierObject = model('Tier', TierSchema)

export const createTier = async (tier) => {
	const httpResponse = new TierObject(tier).save()
		.then(res => {
			console.log(`New tier created with name ${res.name}`)
			return { response: res._id }
		})
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
	return httpResponse
}

export const readTier = (params) => {
	return TierObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => {
			console.log('Error while getting tier: DB error')
		})
}

export const readTiers = (params) => {
	return TierObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => {
			console.log('Error while getting tiers: DB error')
		})
}

export const updateTier = (query, update) => {
	return TierObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => {
			console.log(`Tier with id ${res._id} updated`)
			return { response: res._id }
		})
		.catch(err => {
			console.log('Error while updating tier: DB error')
			return { error: err.code ? err.code : err }
		})
}

export const deleteTier = (query) => {
	return TierObject.findOneAndDelete(query)
		.then(res => {
			console.log(`Tier with id ${res._id} deleted`)
			return { response: "Deletion completed." }
		})
		.catch(err => {
			console.log('Error while deleting tier: DB error')
			return { error: err.code ? err.code : err }
		})
}