export function objectExists(obj) {
    return obj
        ? Object.entries(obj).length > 0 && obj.constructor === Object
        : false
}