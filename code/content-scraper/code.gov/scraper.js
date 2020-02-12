const rp = require('request-promise');
const $ = require('cheerio');
const axios = require('axios')
require('dotenv').config()

const BASE_URL = "https://api.code.gov/repos";
const API_KEY = process.env.CODE_GOV_API_KEY;
const NUMBER_OF_PROJECTS_TO_FETCH = 1000


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
                registerProject({ projectData: transformRepoToProjectData(repo) })
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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODE0MzU4MzF9.bORYCtlt1StA0qdK4zVr3G9_uVso3VWL5cnMDdkrysA"
    options = {
        method: 'POST',
        url: 'http://localhost:5000/api/create/project',
        headers: {
            Authorization: token
        },
        data: { projectData: { ...projectData, creatorName: 'scraper' } }
    }
    axios(options)
        .then(function (response) {
            // console.log(response);
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response.status + ": " + error.response.data);
            }
        });
}


main()