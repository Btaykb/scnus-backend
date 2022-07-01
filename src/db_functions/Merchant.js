import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import jwt from 'jsonwebtoken'
import { JWT_SIGN_KEY } from '../utils/constants.js'

const model = mongoose.model
const Schema = mongoose.Schema
const schemaTypes = Schema.Types

const MerchantSchema = Schema({
	name: { type: schemaTypes.String, required: true, default: 'Event Merchant' },
	phone: { type: schemaTypes.String, required: true, unique: true },
	otp: { type: schemaTypes.String, required: false, unique: false },
	location: { type: schemaTypes.String, required: true},
	terms: { type: [schemaTypes.String], required: true, default: []}
})

MerchantSchema.plugin(uniqueValidator)

export const MerchantObject = model('Merchant', MerchantSchema)

export const createMerchant = async (merchant) => {
	const { name, phone } = merchant
	const httpResponse = new MerchantObject({ name, phone }).save()
		.then(res => {
			console.log(`New merchant created with id ${res._id}`)
			const token = jwt.sign({ _id: res._id, phone: res.phone, __resolveType: 'Merchant' }, JWT_SIGN_KEY)
			return { response: token }
		})
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
	return httpResponse
}

export const readMerchant = (params) => {
	return MerchantObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => {
			console.log('Error while getting merchant')
		})
}

export const readMerchants = (params) => {
	return MerchantObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => {
			console.log('Error while getting merchants')
		})
}

export const updateMerchant = (query, update) => {
	return MerchantObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => {
			console.log(`Merchant with id ${res._id} updated`)
			return { response: res._id }
		})
		.catch(err => {
			console.log('Error while updating merchant')
			return { error: err.code ? err.code : err }
		})
}

export const updateMerchantOTP = (query) => {
	return MerchantObject.findOneAndUpdate(query, { otp: Math.floor(Math.random() * (999999 - 100000) ) + 100000}, { new: true})
	.then(res => res ? ({ response: res.otp }) : ({ error: "Not found" })) // TODO: Remove return
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
}