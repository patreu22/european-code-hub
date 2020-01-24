const rp = require('request-promise');
const $ = require('cheerio');
const axios = require('axios')
require('dotenv').config()

const BASE_URL = "https://api.code.gov/repos";
const API_KEY = process.env.CODE_GOV_API_KEY;


function main() {
    scrapeCodeGov()
}

function scrapeCodeGov() {
    const options = {
        method: 'GET',
        url: BASE_URL,
        params: {
            api_key: API_KEY,
            size: 10,
            // size: 10000
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
    var projectData = {
        projectName: repo.name,
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
        license: repo.permissions.licenses[0].name,
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



