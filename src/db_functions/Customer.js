import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'
const model = mongoose.model
const Schema = mongoose.Schema

const schemaTypes = Schema.Types

const CustomerSchema = Schema({
	name: { type: schemaTypes.String, required: true, default: 'Event Customer' },
	phone: { type: schemaTypes.String, required: true, unique: true }
})

export const CustomerObject = model('Customer', CustomerSchema)

export const createCustomer = async (customer) => {
	const { name, phone } = customer
	const httpResponse = new CustomerObject({ name, phone }).save()
		.then(res => {
			console.log(`New customer created with id ${res._id}`)
			return { response: res._id }
		})
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
	return httpResponse
}

export const readCustomer = (params) => {
	return CustomerObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => {
			console.log('Error while getting customer')
		})
}

export const readCustomers = (params) => {
	return CustomerObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => {
			console.log('Error while getting customers')
		})
}

export const updateCustomer = (query, upate) => {
	return CustomerObject.findOneAndUpdate(query, upate, {upsert: true, new: true})
		.then(res => {
			console.log(`Customer with id ${res._id} updated`)
			return { response: res._id }
		})
		.catch(err => {
			console.log('Error while updating customer')
			return { error: err.code ? err.code : err }
		})
}