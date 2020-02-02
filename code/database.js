const mongoose = require('mongoose');

const models = require('./models');
const authentication = require('./authentication')
const io = require('./io')

function userExists({ mail }) {
    return new Promise(function (resolve, reject) {
        getUser({ mail: mail })
            .then((user) => {
                const userFound = user ? true : false;
                resolve(userFound)
            })
            .catch((error) => {
                reject(error)
            })
    });
}

function connectToDb(db_url) {
    mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Welcome to the fabulous MongoDB world!")
    });
}


function userAndHashExistInDB({ mail, password }) {
    return new Promise(function (resolve, reject) {
        getUser({ mail: mail, stripData: false })
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

function getAllProjects() {
    return new Promise(function (resolve, reject) {
        models.PROJECT_MODEL.find({})
            .collation({ locale: "en" })
            .sort("projectName")
            .then((results) => resolve(results))
            .catch((err) => reject(err))
    })
}

function getProjectChunk(filters, resultsToSkip, itemsPerLoad) {
    const query = _getQueryObject(filters)
    return new Promise(function (resolve, reject) {
        models.PROJECT_MODEL.find(query)
            .skip(resultsToSkip)
            .limit(itemsPerLoad)
            .collation({ locale: "en" })
            .sort("projectName")
            .then((results) => resolve(results))
            .catch((err) => reject(err))
    })
}

function _getQueryObject(filters) {
    var query = {}
    for (let [key, value] of Object.entries(filters)) {
        console.log(`${key}`);
        console.log(value)
        query = { ...query, [key]: value }
    }
    return query
}

function getProjectByName(projectName) {
    return new Promise(function (resolve, reject) {
        models.PROJECT_MODEL.find({ projectName }, function (err, projects) {
            if (err) {
                reject(err)
            } else {
                if (projects.length === 0) {
                    reject({ response: { status: 404 }, message: `No project with name ${projectName}` })
                } else {
                    resolve(projects[0])
                }
            }
        });
    })
}

function updateSessionToken({ mail, token }) {
    return new Promise(function (resolve, reject) {
        getUser({ mail: mail, stripData: false })
            .then((user) => {
                user.lastSessionToken = token;
                user.save(function (err) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(true)
                    }
                });
            })
            .catch(() => {
                reject(error)
            })
    })
}

//Set one of the parameters and the stripData parameter
function getUser({ token, mail, username, stripData = true }) {
    const User = models.USER_MODEL;
    var key = ''
    var value = ''
    if (username) {
        key = 'username'
        value = username
    } else if (mail) {
        key = 'mail'
        value = mail
    } else if (token) {
        key = 'lastSessionToken'
        value = token
    }

    var findUserRequest = User.findOne({ [key]: value });
    if (stripData) {
        findUserRequest = findUserRequest.select("username mail position profilePicture");
    }

    return new Promise(function (resolve, reject) {
        findUserRequest.exec(function (err, user) {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                if (user) {
                    resolve(user)
                } else (resolve(null))
            }
        })
    });
}

function updateProjectReadme(projectName, readmeText) {
    return new Promise(function (resolve, reject) {
        models.PROJECT_MODEL.findOne({ projectName }, function (err, projectData) {
            if (projectData) {
                projectData.readme = readmeText
                projectData.save(function (err) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        console.log(`Updated project ${projectName}`)
                        resolve(true)
                    }
                });
            } else {
                reject(err)
            }
        });
    });
}


function saveUserToDB({ username, password, mail, position, profileImagePath, lastSessionToken }) {
    const newUser = models.USER_MODEL({
        username: username,
        password: password,
        mail: mail,
        position: position,
        profilePicture: { data: io.getProfileImageOrDefaultData(profileImagePath), contentType: "image/png" },
        lastSessionToken: lastSessionToken
    });
    return new Promise(function (resolve, reject) {
        newUser.save(function (err, newUser) {
            io.deleteProfileImageFromHardDrive(profileImagePath)
            if (err) {
                console.log(err);
                reject(error)

            } else {
                console.log(newUser);
                console.log("Saved to DB");
                resolve(true)
            }
        });
    });
}

//TODO: Handle duplicates "Project already registered"
function saveProjectToDB(projectData) {
    const newProject = models.PROJECT_MODEL({
        ...projectData,
        date: {
            created: projectData.dateCreated,
            lastModified: projectData.dateLastModified
        }
    })
    return new Promise(function (resolve, reject) {
        newProject.save(function (err, newProject) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                console.log(newProject);
                console.log("Saved to DB");
                resolve({ newProject, saved: true })
            }
        });
    });
}



module.exports = {
    userExists: userExists,
    getAllProjects: getAllProjects,
    userAndHashExistInDB: userAndHashExistInDB,
    saveUserToDB: saveUserToDB,
    saveProjectToDB: saveProjectToDB,
    connectToDb: connectToDb,
    updateSessionToken: updateSessionToken,
    getUser: getUser,
    getProjectByName: getProjectByName,
    updateProjectReadme: updateProjectReadme,
    getProjectChunk: getProjectChunk,
}