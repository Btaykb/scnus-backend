import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import jwt from 'jsonwebtoken'
import { JWT_SIGN_KEY } from '../utils/constants.js'

const model = mongoose.model
const Schema = mongoose.Schema
const schemaTypes = Schema.Types

const AdminSchema = Schema({
	name: { type: schemaTypes.String, required: true, default: 'Event Admin' },
	phone: { type: schemaTypes.String, required: true, unique: true },
	otp: { type: schemaTypes.String, required: false, unique: false }
})


AdminSchema.plugin(uniqueValidator)

export const AdminObject = model('Admin', AdminSchema)

export const createAdmin = async (admin) => {
	const { name, phone } = admin
	const httpResponse = new AdminObject({ name, phone }).save()
		.then(res => {
			console.log(`New admin created with id ${res._id}`)
			const token = jwt.sign({ _id: res._id, phone: res.phone, __resolveType: 'Admin' }, JWT_SIGN_KEY)
			return { response: token }
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

export const updateAdminOTP = (query) => {
	return AdminObject.findOneAndUpdate(query, { otp: Math.floor(Math.random() * (999999 - 100000) ) + 100000}, { new: true})
		.then(res => ({ response: res.otp })) // TODO: Remove return
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
}