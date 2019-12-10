const rp = require('request-promise');
const BASE_URL = "https://opensourceprojects.eu";
const PROJECT_OVERVIEW_PAGE = BASE_URL + '/p/?page=PLACEHOLDER';
const $ = require('cheerio');

const CHECKMARK_UNICODE = "\u2713";

async function scrapeOpensourceProjectsEU() {
    const numberOfPages = 5;
    var results = []
    var errors = []
    var ignored = 0
    var urls = [];

    for (let i = 0; i < numberOfPages; i++) {
        const modifiedUrl = PROJECT_OVERVIEW_PAGE.replace("PLACEHOLDER", i)
        urls.push(modifiedUrl)
    }

    // urls.forEach(async function (url, index) {
    //     console.log("Hello " + index)
    //     const html = await rp(url)
    //     console.log(html)
    //     results.push(html)
    // });

    // await Promise.all(urls.map(async (url, index) => {
    //     console.log("Hello " + index)
    //     const html = await rp(url)
    //     // console.log(html)
    //     results.push(html)
    // }))
    // console.log(results)

    await Promise.all(urls.map(async (url, index) => {
        console.log("Hello " + index)
        const html = await rp(url)
        try {
            const list = $('.list', html);
            const projects = $('.proj', list);
            console.log(projects)
            projects.each(async function (index, currentProject) {
                let midBar = $('.middlebar', currentProject);
                let project = $('.projname', midBar);
                let projectName = project.text();
                let projectDescription = $('.projdesc', midBar).text().trim().capitalize();
                let projectLink = $('a', project).attr('href');
                console.log("Link: " + projectLink)
                const projectPage = await rp(BASE_URL + projectLink)
            })

            // await projects.each(async function (index, currentProject) {
            // });
        } catch (e) {
            console.log("Outer")
            console.log(`Status: ${e}`)
        }
    }))

    // for (let i = 0; i < numberOfPages; i++) {
    //     const modifiedUrl = PROJECT_OVERVIEW_PAGE.replace("PLACEHOLDER", i)
    //     const html = await rp(modifiedUrl)
    //     console.log(modifiedUrl)
    // try {
    //     const list = $('.list', html);
    //     const projects = $('.proj', list);
    //     // projects.forEach(element => console.log(element));
    //     await projects.each(async function (index, currentProject) {
    //         let midBar = $('.middlebar', currentProject);
    //         let project = $('.projname', midBar);
    //         let projectName = project.text();
    //         let projectDescription = $('.projdesc', midBar).text().trim().capitalize();
    //         let projectLink = $('a', project).attr('href');
    //         console.log("Link: " + projectLink)
    //         try {
    //             const projectPage = await rp(BASE_URL + projectLink)
    //             const cloneCommand = $('.clone_command', projectPage).text().trim().replace(/(\r\n|\n|\r|\\n)/gm, '');
    //             if (cloneCommand.startsWith('git')) {
    //                 const removedCloneCommand = cloneCommand.replace('git clone', '').trim()
    //                 const blankGitUrl = removedCloneCommand.substring(0, removedCloneCommand.indexOf(' '));
    //                 const result = { projectName: projectName, projectDescription: projectDescription, gitUrl: blankGitUrl }
    //                 if (result.projectName !== '') {
    //                     results.push(result)
    //                 } else {
    //                     console.log("Result empty. Won't push it to results stack")
    //                 }
    //             } else if (cloneCommand.startsWith('svn')) {
    //                 console.log(`Only SVN repo found for ${projectLink}. Ignored.`)
    //                 ignored++;
    //             } else {
    //                 console.log(`No git repo found for ${projectLink}. Ignored.`)
    //                 ignored++;
    //             }
    //         } catch (e) {
    //             console.log(e)
    //             console.log(`Error: ${e.response.statusCode} - No repo found at ${projectLink}.`)
    //             errors.push(e.response);
    //         }
    //     });
    // } catch (e) {
    //     console.log("Outer")
    //     console.log(`Status: ${e}`)
    // }

    return new Promise(resolve => {
        resolve({ errors: errors, results: results, ignored: ignored })
    });
}

String.prototype.capitalize = function () {
    if (this.length == 0) {
        return ''
    } else {
        return this.charAt(0).toUpperCase() + this.slice(1)
    }
}

function main() {
    const result = scrapeOpensourceProjectsEU().then(function (result) {
        console.log("Done " + CHECKMARK_UNICODE + " Scraped " + result.results.length + " projects in total");
        console.log("Ignored " + result.ignored + " in total.")
        console.log(`${result.errors.length} errors occurred.`);
        result.errors.forEach(error => {
            console.log(`Error with StatusCode ${error.statusCode}`)
        })
    });
}


main()



