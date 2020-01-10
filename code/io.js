const fs = require('fs');
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

module.exports = {
    getProfileImageOrDefaultData: getProfileImageOrDefaultData,
    deleteProfileImageFromHardDrive: deleteProfileImageFromHardDrive,
    getUploadMiddleware: getUploadMiddleware
}