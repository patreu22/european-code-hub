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
                //TODO do an API call
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
    axios.post('http://localhost:5000/api/create/project', { projectData: projectData })
        .then(function (response) {
            // console.log(response);
        }).catch(function (error) {
            // console.log(error);
        });
}


main()