import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const model = mongoose.model
const Schema = mongoose.Schema
const schemaTypes = Schema.Types

const AdminSchema = Schema({
	name: { type: schemaTypes.String, required: true, default: 'Event Admin' },
	phone: { type: schemaTypes.String, required: true, unique: true }
})

AdminSchema.plugin(uniqueValidator)

export const AdminObject = model('Admin', AdminSchema)

export const createAdmin = async (admin) => {
	const { name, phone } = admin
	const httpResponse = new AdminObject({ name, phone }).save()
		.then(res => {
			console.log(`New admin created with id ${res._id}`)
			return { response: res._id }
		})
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
	return httpResponse
}

export const readAdmin = (params) => {
	return AdminObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => {
			console.log('Error while getting admin')
		})
}

export const readAdmins = (params) => {
	return AdminObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => {
			console.log('Error while getting admins')
		})
}

export const updateAdmin = (query, update) => {
	return AdminObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => {
			console.log(`Admin with id ${res._id} updated`)
			return { response: res._id }
		})
		.catch(err => {
			console.log('Error while updating admin')
			return { error: err.code ? err.code : err }
		})
}