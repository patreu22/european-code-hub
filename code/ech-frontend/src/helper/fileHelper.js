export function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

export function parseToJsonObject(file) {
    return new Promise((resolve, reject) => {
        readFileContent(file)
            .then(fileContent => {
                const json = JSON.parse(fileContent)
                resolve(json)
            })
            .catch(err => reject(err))
    })
}