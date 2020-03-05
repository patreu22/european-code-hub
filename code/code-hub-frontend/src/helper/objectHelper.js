export function objectExists(obj) {
    return obj
        ? Object.entries(obj).length > 0 && obj.constructor === Object
        : false
}

export function objectsAreEqual(o1, o2) {
    return JSON.stringify(o1) === JSON.stringify(o2)
}