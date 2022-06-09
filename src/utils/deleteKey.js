export default function deleteKey(obj, keys) {
	const clone = {...obj}
	keys.forEach(key => delete clone[key])
	return clone
}