export default function isToday(date) {
	const today = new Date()
	return today.toDateString() === new Date(date).toDateString()
}