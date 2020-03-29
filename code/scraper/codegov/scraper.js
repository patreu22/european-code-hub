const rp = require('request-promise');
const $ = require('cheerio');
const axios = require('axios')
require('dotenv').config()

const BASE_URL = "https://api.code.gov/repos";
const API_KEY = process.env.CODE_GOV_API_KEY;
const NUMBER_OF_PROJECTS_TO_FETCH = 1000

var BACKEND_BASE_ENDPOINT = process.env.BACKEND_BASE_ENDPOINT || "localhost:5000"

var counter = 0

function main() {
    scrapeCodeGov()
}

function scrapeCodeGov() {
    const options = {
        method: 'GET',
        url: BASE_URL,
        params: {
            api_key: API_KEY,
            size: NUMBER_OF_PROJECTS_TO_FETCH,
        }
    }

    axios(options)
        .then((response) => {
            const repos = response.data.repos;
            repos.forEach(repo => {
                sleep(200).then(() => registerProject({ projectData: transformRepoToProjectData(repo) }))
            });
        })
}

function transformRepoToProjectData(repo) {
    var license;
    if (typeof repo.permissions != "undefined") {
        if (typeof repo.permissions.licenses !== "undefined") {
            if (typeof repo.permissions.licenses[0] !== "undefined") {
                license = repo.permissions.licenses[0].name
            } else {
                license = null
            }
        }
    }


    const projectName = repo.name.trim()

    var projectData = {
        projectName: projectName,
        projectDescription: repo.description,
        organization: repo.organization,
        contact: {
            name: repo.contact.name,
            email: repo.contact.email,
        },
        date: {
            created: repo.date.created,
            lastModified: repo.date.lastModified
        },
        repoUrl: repo.repositoryURL,
        programmingLanguages: repo.languages,
        readme: "",
        license: license,
        version: repo.version,
        status: repo.status
    }
    return projectData
}

function registerProject({ projectData }) {
    counter += 1;
    console.log(`Registering project #${counter}`)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODE0MzU4MzF9.bORYCtlt1StA0qdK4zVr3G9_uVso3VWL5cnMDdkrysA"
    options = {
        method: 'POST',
        url: `${BACKEND_BASE_ENDPOINT}/api/create/project`,
        headers: {
            Authorization: token
        },
        data: { projectData: { ...projectData, creatorName: 'scraper' } }
    }
    sleep(100).then(() => {
        axios(options)
            .then(function () {
                console.log("Finished registering.")
                // console.log(response);
            }).catch(function (error) {
                // console.log(error)
                if (error.response) {
                    console.log(error.response.status + ": " + JSON.stringify(error.response.data));
                }
            });
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


main()