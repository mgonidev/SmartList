export function validateProductName(name) {
    return typeof name === 'string' && name.trim().length > 0;
}
