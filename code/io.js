const fs = require('fs');
const request = require('request');
const readline = require('readline');
const multer = require('multer');

function getUploadMiddleware() {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'temp')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
        }
    })
    const upload = multer({ storage: storage })
    return upload
}

function getProfileImageOrDefaultData(profileImagePath) {
    if (profileImagePath == null) {
        return null
    } else {
        const imageFile = fs.readFileSync(profileImagePath);
        var encode_image = imageFile.toString('base64');
        return Buffer.from(encode_image, 'base64');
    }
}

function deleteProfileImageFromHardDrive(profileImagePath) {
    if (profileImagePath != null) {
        fs.unlinkSync(profileImagePath);
    }
}

function getRemoteMarkdownFileAsDataString(repoLink) {
    return new Promise((resolve, reject) => {
        _requestReadme(resolve, reject, repoLink);
    });
}

function _requestReadme(resolve, reject, repoLink, readmeFileName) {
    const possibleReadmeFileNames = ["README.md", "README.markdown", "README.txt", "Readme.txt", "README.rst"]
    const readmeUrl = _getReadmeUrl(repoLink, readmeFileName)
    if (readmeUrl) {
        request(readmeUrl)
            .on('response', function (response) {
                if (response.statusCode === 200) {
                    const writeStream = _getWriteStream(resolve, reject, repoLink)
                    response.pipe(writeStream)
                } else if (response.statusCode === 404) {
                    if (readmeFileName === possibleReadmeFileNames[possibleReadmeFileNames.length - 1]) {
                        reject({ error: "Can't find any Readme" })
                    } else {
                        const index = possibleReadmeFileNames.indexOf(readmeFileName)
                        if (index > -1 && index + 1 <= possibleReadmeFileNames.length - 1) {
                            const nextReadmeName = possibleReadmeFileNames[index + 1]
                            _requestReadme(resolve, reject, repoLink, nextReadmeName)
                        } else {
                            reject({ code: 404, error: "Could not find any Readme" })
                        }
                    }
                } else {
                    reject({ error: "Unknown status code" })
                }
            })
            .on('error', function (err) {
                console.error(err)
            })
    } else {
        reject({ code: 404, error: "No valid Readme Url provided" })
    }
}

function _getWriteStream(resolve, reject, repoLink) {
    const repoName = _getRepoName(repoLink)
    const tempFileName = `temp/${repoName}-readme${Date.now()}`
    const writeStream = fs.createWriteStream(tempFileName)

    writeStream.on('close', function () {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(tempFileName),
            console: false
        });

        var markdownString = ""
        readInterface.on('line', function (line) {
            markdownString = markdownString + line + "\n"
        });

        readInterface.on('close', function () {
            fs.unlink(tempFileName, () => { })
            resolve(markdownString)
        });
    });

    writeStream.on('error', function (err) {
        console.log(err);
        reject(err)
    });

    return writeStream
}

function _getReadmeUrl(repoUrl, readmeFileName = "README.md") {
    if (typeof repoUrl === "undefined") return ""

    const splittedUrl = repoUrl.split("github.com/")
    if (splittedUrl.length > 1) {
        const aftersplitted_url = splittedUrl[1].split("/");
        const repoOwner = aftersplitted_url[0]
        const repoName = aftersplitted_url[1]
        const url = "https://raw.githubusercontent.com/" + repoOwner + "/" + repoName + "/master/" + readmeFileName
        return url.replace(".git/master/README.md", "/master/README.md")
    } else return ""
}

function _getRepoName(repoUrl) {
    const splittedUrl = repoUrl.split("github.com/")[1].split("/");
    const repoName = splittedUrl[1]
    return repoName || ""
}

module.exports = {
    getProfileImageOrDefaultData: getProfileImageOrDefaultData,
    deleteProfileImageFromHardDrive: deleteProfileImageFromHardDrive,
    getUploadMiddleware: getUploadMiddleware,
    getRemoteMarkdownFileAsDataString: getRemoteMarkdownFileAsDataString
}