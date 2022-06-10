export default function validatePhone(discount) {
    return (discount >= 0 && discount <= 1);
}