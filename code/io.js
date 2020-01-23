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
    console.log(`ProfileImagePath: ${profileImagePath}`)
    if (profileImagePath == null) {
        return fs.readFileSync("profile-placeholder.png")
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
        const url = _getReadmeUrl(repoLink)
        const tempFileName = `temp/readme${Date.now()}`
        const writeStream = fs.createWriteStream(tempFileName)
        request(url).pipe(writeStream)

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
    });
}

function _getReadmeUrl(repoUrl) {
    const splittedUrl = repoUrl.split("github.com/")[1].split("/");
    const repoOwner = splittedUrl[0]
    const repoName = splittedUrl[1]
    const url = "https://raw.githubusercontent.com/" + repoOwner + "/" + repoName + "/master/README.md"
    return url.replace(".git/master/README.md", "/master/README.md")
}

module.exports = {
    getProfileImageOrDefaultData: getProfileImageOrDefaultData,
    deleteProfileImageFromHardDrive: deleteProfileImageFromHardDrive,
    getUploadMiddleware: getUploadMiddleware,
    getRemoteMarkdownFileAsDataString: getRemoteMarkdownFileAsDataString
}