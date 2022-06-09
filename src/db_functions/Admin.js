import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'
const model = mongoose.model
const Schema = mongoose.Schema

const schemaTypes = Schema.Types

const AdminSchema = Schema({
	name: { type: schemaTypes.String, required: true, default: 'Event Admin' },
	phone: { type: schemaTypes.String, required: true, unique: true }
})

export const AdminObject = model('Admin', AdminSchema)

export const createAdmin = async (admin) => {
	const { name, phone } = admin
	const httpResponse = new AdminObject({ name, phone }).save()
		.then(res => {
			console.log(`New admin created with id ${res._id}`)
			return { response: res._id }
		})
		.catch(err => {
			return { error: err.code }
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