const rp = require('request-promise');
const BASE_URL = "https://opensourceprojects.eu";
const PROJECT_OVERVIEW_PAGE = BASE_URL + '/p/?page=PLACEHOLDER';
const $ = require('cheerio');

const CHECKMARK_UNICODE = "\u2713";

async function scrapeOpensourceProjectsEU() {
    const numberOfPages = 5;
    var total = []
    var results = []
    var failedRequests = [];
    var noRepo = []
    var svnIgnored = []
    var urls = [];

    // Desired output:
    // Done ✓ Scraped 70 project(s) in total
    // Received 44 results.
    // Ignored 16 SVN project(s) in total.
    // No repo found for 10 project(s) in total.
    // 0 request(s) failed.

    for (let i = 0; i < numberOfPages; i++) {
        const modifiedUrl = PROJECT_OVERVIEW_PAGE.replace("PLACEHOLDER", i)
        urls.push(modifiedUrl)
    }

    await Promise.all(urls.map(async (url, index) => {
        const html = await rp(url)
        var currentProject;
        try {
            const list = $('.list', html);
            const projects = $('.proj', list);
            const maxProjectsPerPage = 100;
            for (let i = 0; i < maxProjectsPerPage; i++) {
                currentProject = projects[i]
                if (typeof currentProject === 'undefined') {
                    //console.log("Project undefined");
                    break;
                } else {
                    let midBar = $('.middlebar', currentProject);
                    let project = $('.projname', midBar);
                    let projectName = project.text();
                    let projectDescription = $('.projdesc', midBar).text().trim().capitalize();
                    let projectLink = $('a', project).attr('href');
                    total.push(projectLink)
                    console.log("Link: " + projectLink)
                    try {
                        const projectPage = await rp(BASE_URL + projectLink)
                        const repoCommand = $('.clone_command', projectPage).text().trim()
                        console.log(`Link: ${projectLink} | Repo-Command: ${repoCommand}`);
                        if (repoCommand === '') {
                            console.log(`No clone command found for ${projectLink}. Scraping another page.`)
                            try {
                                codeLink = $(".ui-icon-tool-git", projectPage).attr('href')
                                console.log(codeLink)
                                console.log(typeof codeLink)
                                if (typeof codeLink === 'undefined') {
                                    noRepo.push(BASE_URL + projectLink)
                                    console.log("No repo available.")
                                } else {
                                    console.log("Scrape one more time...")
                                    try {
                                        const codePage = await rp(BASE_URL + codeLink)
                                        const formattedUrl = getFormattedGitRepoUrl($('.clone_command', codePage).text())
                                        console.log("############################")
                                        console.log(formattedUrl)
                                        const result = { projectName: projectName, projectDescription: projectDescription, gitUrl: formattedUrl }
                                        results.push(result)
                                    } catch (e) {
                                        console.log("Inner - Caught error - probably 502 server response.")
                                        failedRequests.push({ errorCode: e.response.statusCode, link: BASE_URL + codeLink })
                                    }
                                }

                            } catch (e) {
                                console.log(e)
                            }
                        } else {
                            // TODO: Delete trailing part of the git command
                            // //console.log(cloneCommand)
                            if (repoCommand.startsWith('git')) {
                                const formattedUrl = getFormattedGitRepoUrl(repoCommand);
                                const result = { projectName: projectName, projectDescription: projectDescription, gitUrl: formattedUrl }
                                if (result.projectName !== '') {
                                    results.push(result)
                                } else {
                                    //console.log("Result empty. Won't push it to results stack")
                                }

                            } else if (repoCommand.startsWith('svn')) {
                                //console.log(`Only SVN repo found for ${projectLink}. Ignored.`)
                                svnIgnored.push(projectLink)
                            } else {
                                //console.log(`No git repo found for ${projectLink}. Ignored.`)
                                noRepo.push(BASE_URL + projectLink)
                            }
                        }
                    } catch (e) {
                        console.log(e)
                        console.log("Outer - Caught error - probably 502 server response.")
                        failedRequests.push({ errorCode: e.response.statusCode, link: BASE_URL + projectLink })
                    }
                }
            }
        } catch (e) {
            console.log("Most Outer error - Caught error - probably 502 server response.")
            failedRequests.push({ errorCode: e.response.statusCode, link: BASE_URL + projectLink })
        }
    }))


    return new Promise(resolve => {
        resolve({ failedRequests: failedRequests, results: results, noRepo: noRepo, svnIgnored: svnIgnored, total: total })
    });
}

String.prototype.capitalize = function () {
    if (this.length == 0) {
        return ''
    } else {
        return this.charAt(0).toUpperCase() + this.slice(1)
    }
}

function getFormattedGitRepoUrl(url) {
    const link = url.trim().replace(/(\r\n|\n|\r|\\n)/gm, '')
    const removedCloneCommand = link.replace('git clone', '').trim()
    const blankUrl = removedCloneCommand.substring(0, removedCloneCommand.indexOf(' '));
    return blankUrl;
}


function main() {
    scrapeOpensourceProjectsEU().then(function (result) {
        console.log("Done " + CHECKMARK_UNICODE + " Scraped " + result.total.length + " project(s) in total");
        console.log("Received " + result.results.length + " results.")
        console.log("Ignored " + result.svnIgnored.length + " SVN project(s) in total.")
        console.log("No repo found for " + result.noRepo.length + " project(s) in total.")
        console.log(`${result.failedRequests.length} request(s) failed.`);
        // if (result.failedRequests.length > 0) {
        //     console.log("--- Failed Requests ---")
        //     result.failedRequests.forEach(failedRequest => console.log(failedRequest))
        // }
        // if (result.noRepo.length > 0) {
        //     console.log("--- No repo found ---")
        //     result.noRepo.forEach(noRepo => console.log(noRepo))
        // }
        // if (result.results.length > 0) {
        //     console.log("--- Results ---")
        //     result.results.forEach(result => console.log(result))
        // }
    });
}


main()



