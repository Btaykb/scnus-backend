import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'

const model = mongoose.model
const Schema = mongoose.Schema
const schemaTypes = Schema.Types

const RedemptionSchema = Schema({
	merchantId: { type: schemaTypes.String, required: true },
	customerId: { type: schemaTypes.String, required: true },
	amount: { type: schemaTypes.Number, required: true },
	discount: { type: schemaTypes.Number, required: true },
	time: { type: schemaTypes.String, required: true }
})

export const RedemptionObject = model('Redemption', RedemptionSchema)

export const createRedemption = async (redemption) => {
	const httpResponse = new RedemptionObject({
		...redemption, 
		time: new Date().toTimeString()
	}).save()
		.then(res => {
			console.log(`New redemption created with id ${res._id}`)
			return { response: res._id }
		})
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
	return httpResponse
}

export const readRedemption = (_id) => {
	return RedemptionObject.findOne({ _id: _id})
		.then(unpackSingleDocument)
		.catch(err => {
			console.log('Error while getting redemption: DB error')
		})
}

export const readRedemptions = (params) => {
	return RedemptionObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => {
			console.log('Error while getting redemptions: DB error')
		})
}