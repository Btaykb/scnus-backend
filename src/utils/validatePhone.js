export default function validatePhone(phone) {
    return /^[0-9]+$/.test(phone.replace(" ", ""));
}