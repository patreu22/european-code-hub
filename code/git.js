function fetchGitData(url) {
    return new Promise(function (resolve, reject) {
        console.log("# Start Fetch!")
        if (url) {
            resolve(true)
        } else {
            reject({ msg: "No url provided" })
        }
    })
}

module.exports = {
    fetchGitData: fetchGitData
}