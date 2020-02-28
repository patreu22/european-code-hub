const axios = require('axios')
const dotenv = require('dotenv')

const API_BASE = "https://api.github.com"
const API_REPOS_ENDPOINT = API_BASE + "/repos"
const API_TAGS_ENDING = "/tags"

dotenv.config()

function fetchGitData(url) {
    return new Promise(function (resolve, reject) {
        const repoOwner = getRepoOwner(url)
        const repoName = getRepoName(url)
        const options = {
            method: 'GET',
            url: `${API_REPOS_ENDPOINT}/${repoOwner}/${repoName}`,
            headers: { Authorization: process.env.GITHUB_OAUTH_TOKEN },
        }

        var dataToReturn = {}
        if (url) {
            axios(options)
                .then((response) => {
                    const data = response.data
                    if (data.created_at) {
                        dataToReturn.created = data.created_at
                    }
                    if (data.updated_at) {
                        dataToReturn.lastModified = data.created_at
                    }
                    if (data.html_url) {
                        dataToReturn.repoUrl = data.html_url
                    }
                    if (data.language) {
                        dataToReturn.languages = [data.language]
                    }
                    if (data.license) {
                        if (data.license.name) {
                            dataToReturn.projectName = data.name
                        }
                    }

                    getLatestVersion(repoOwner, repoName)
                        .then((version) => {
                            if (version) {
                                dataToReturn.version = version
                            }
                            resolve(dataToReturn)
                        })
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        } else {
            reject({ msg: "No url provided" })
        }
    })
}

function getLatestVersion(repoOwner, repoName) {
    return new Promise(function (resolve, reject) {
        const options = {
            method: 'GET',
            url: getTagsEndpoint(repoOwner, repoName),
            headers: { Authorization: process.env.GITHUB_OAUTH_TOKEN },
        }

        axios(options)
            .then((response) => {
                const data = response.data
                if (data.length > 0) {
                    const latestTagEntry = data[0]
                    resolve(latestTagEntry.name)
                } else {
                    resolve("")
                }
            })
            .catch(() => resolve(""))
    })
}

function getRepoName(repoUrl) {
    const splittedUrl = repoUrl.split("github.com/")[1].split("/");
    const repoName = splittedUrl[1]
    return repoName || ""
}

function getRepoOwner(repoUrl) {
    const splittedUrl = repoUrl.split("github.com/")[1].split("/");
    const repoOwner = splittedUrl[0]
    return repoOwner || ""
}

function getTagsEndpoint(repoOwner, repoName) {
    return `${API_REPOS_ENDPOINT}/${repoOwner}/${repoName}${API_TAGS_ENDING}`
}

module.exports = {
    fetchGitData,
    getRepoName
}