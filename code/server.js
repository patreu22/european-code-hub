const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require('./models');
const authentication = require('./authentication')
const fs = require('fs');
const multer = require('multer');

const MONGOOSE_DB_URL = 'mongodb://localhost:27017/code-hub';

const app = express();

app.use(express.static(path.join(__dirname, 'code-hub-frontend/build')));
app.use(bodyParser.json());

mongoose.connect(MONGOOSE_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Welcome to the fabulous MongoDB world!")
});



// SET MULTER STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'code-hub-frontend/build/index.html'));
});

app.post('/api/create/project', function (req, res) {
    const project = req.body;
    _saveProjectToDB({
        gitUrl: project.gitUrl,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        contactMail: project.contactMail,
    }).then(saved => {
        if (saved) {
            //200: Accepted
            res.sendStatus(200);
        } else {
            //202: Accepted but could not be processed
            res.sendStatus(202)
        }
    }).catch(error => {
        //500: Internal Server error
        res.sendStatus(500);
    })
})

app.post('/api/create/user', upload.single('profileImageFile'), (req, res) => {
    const user = req.body;
    _userExists({ mail: user.mail })
        .then(userExists => {
            if (!userExists) {
                const profileImagePath = req.file ? req.file.path : null;
                const hash = authentication.getPasswordHash(user.password)
                _saveUserToDB({
                    username: user.username,
                    password: hash,
                    mail: user.mail,
                    position: user.position,
                    profileImagePath: profileImagePath,
                }).then(savedUser => {
                    if (savedUser) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(500);
                    }
                }).catch(err => {
                    res.sendStatus(500)
                });
            } else {
                //400: Bad Request
                //TODO: Handle to show error message
                return res.sendStatus(400);
            }
        });
});

app.get('/api/get/projects', function (req, res) {
    models.PROJECT_MODEL.find({}, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            return res.send(docs)
        }
    });
});

app.post('/api/create/token', function (req, res) {
    return new Promise(function (resolve, reject) {
        const authValues = req.body;
        userAndHashExistInDB({ mail: authValues.mail, password: authValues.password }).then(pairExists => {
            if (pairExists) {
                const token = authentication.generateWebtoken(authValues.mail, authValues.password)
                return res.status(200).send(token)
            } else {
                return res.sendStatus(400);
            }
        })
    });
});

app.get('/api/get/user/profileImage/:mail', async function (req, res) {
    var mail = req.params.mail;
    _getUserWithEmail(mail)
        .then((user) => {
            return res.status(200).contentType(user.profilePicture.contentType).send(user.profilePicture.data)
        })
        .catch(() => {
            console.log("No user found");
            return res.sendStatus(404)
        });
});

app.listen(process.env.PORT || 5000, function () {
    console.log(`Serving on port ${process.env.PORT || 5000}`);
});

function userAndHashExistInDB({ mail, password }) {
    return new Promise(function (resolve, reject) {
        _getUserWithEmail(mail)
            .then((user) => {
                const hash = user ? user.password : "-1"
                authentication.checkPassword(password, hash)
                    .then(isValid => {
                        resolve(isValid)
                    })
                    .catch((error) => {
                        reject(error)
                    });
            })
            .catch((error) => {
                reject(error)
            })
    });
}

function _userExists({ mail }) {
    return new Promise(function (resolve, reject) {
        _getUserWithEmail(mail)
            .then((user) => {
                const userFound = user ? true : false;
                resolve(userFound)
            })
            .catch((error) => {
                reject(error)
            })
    });
}

function _getUserWithEmail(mail) {
    const User = models.USER_MODEL;
    var findUserRequest = User.findOne({ 'mail': mail });

    return new Promise(function (resolve, reject) {
        findUserRequest.exec(function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user)
            }
        })
    });
}

function _getProfileImageOrDefaultData(profileImagePath) {
    console.log(profileImagePath)
    if (profileImagePath == null) {
        return fs.readFileSync("profile-placeholder.png")
    } else {
        const imageFile = fs.readFileSync(profileImagePath);
        var encode_image = imageFile.toString('base64');
        return Buffer.from(encode_image, 'base64');
    }
}

async function _deleteProfileImageFromHardDrive(profileImagePath) {
    if (profileImagePath != null) {
        fs.unlink(profileImagePath, () => { console.log("Deleted " + profileImagePath) });
    }
}

//TODO: Handle duplicates "User already registered"
function _saveUserToDB({ username, password, mail, position, profileImagePath }) {
    const newUser = models.USER_MODEL({
        username: username,
        password: password,
        mail: mail,
        position: position,
        profilePicture: { data: _getProfileImageOrDefaultData(profileImagePath), contentType: "image/png" }
    });
    return new Promise(function (resolve, reject) {
        newUser.save(function (err, newUser) {
            _deleteProfileImageFromHardDrive(profileImagePath)
            if (err) {
                console.log(err);
                reject(error.toJson())

            } else {
                console.log(newUser);
                console.log("Saved to DB");
                resolve(true)
            }
        });
    });
}

//TODO: Handle duplicates "Project already registered"
function _saveProjectToDB({ gitUrl, projectName, projectDescription, contactMail }) {
    const newProject = models.PROJECT_MODEL({
        gitUrl: gitUrl,
        projectName: projectName,
        projectDescription: projectDescription,
        contactMail: contactMail
    })
    return new Promise(function (resolve, reject) {
        newProject.save(function (err, newProject) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                console.log(newProject);
                console.log("Saved to DB");
                resolve(true)
            }
        });
    });
}