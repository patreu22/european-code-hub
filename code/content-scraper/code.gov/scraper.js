const rp = require('request-promise');
const $ = require('cheerio');
const axios = require('axios')
require('dotenv').config()

const BASE_URL = "https://api.code.gov/repos";
const API_KEY = process.env.CODE_GOV_API_KEY;

const MONGOOSE_DB_URL = 'mongodb://localhost:27017/code-hub';
const CHECKMARK_UNICODE = "\u2713";


function main() {
    scrapeCodeGov()
}

function scrapeCodeGov() {
    const options = {
        method: 'GET',
        url: "https://api.code.gov/repos",
        params: {
            api_key: API_KEY,
            size: 10000
        }
    }

    axios(options)
        .then((response) => {
            console.log(response.data)
        })
}


main()



