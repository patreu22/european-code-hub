const mongoose = require('mongoose');

const models = require('./models');
const mail_package = require('./mail')
const authentication = require('./authentication')
const io = require('./io')

var db;

function userExists({ mail, username }) {
    const queryObject = mail
        ? { mail }
        : { username }
    return new Promise(function (resolve, reject) {
        getUser(queryObject)
            .then((user) => {
                const userFound = user ? true : false;
                resolve(userFound)
            })
            .catch((error) => {
                reject(error)
            })
    });
}

function projectExists({ projectName, repoUrl }) {
    return new Promise(function (resolve, reject) {
        console.log(projectName, repoUrl)
        if (projectName) {
            getProject({ projectName })
                .then((project) => {
                    if (project) {
                        resolve({ code: 409, errorType: "projectNameExists", exists: true })
                    }
                })
                .catch(() => {
                    getProject({ repoUrl })
                        .then((project) => {
                            if (project) {
                                resolve({ code: 409, errorType: "repoUrlExists", exists: true })
                            } else {
                                reject({ code: 404, message: "No repoUrl provided" })
                            }
                        })
                        .catch(() => resolve({ exists: false }))
                })
        } else {
            reject({ response: { status: 404 }, message: "No project name provided" })
        }
    });
}


function connectToDb(db_url) {
    mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => console.log("Welcome to the fabulous MongoDB world!"));
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

function getProjectsOfUser(username) {
    return new Promise(function (resolve, reject) {
        models.PROJECT_MODEL.find({ creatorName: username })
            .collation({ locale: "en" })
            .sort("projectName")
            .then((results) => resolve(results))
            .catch((err) => reject(err))
    })
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

function getProjectChunk(filters, resultsToSkip, itemsPerLoad, sortBy) {
    const query = _getQueryObject(filters)
    return new Promise(function (resolve, reject) {
        models.PROJECT_MODEL.find(query)
            .sort(sortBy)
            .skip(resultsToSkip)
            .limit(itemsPerLoad)
            .collation({ locale: "en" })
            .then((results) => resolve(results))
            .catch((err) => reject(err))
    })
}

function _getQueryObject(filters) {
    var query = {}
    for (let [key, value] of Object.entries(filters)) {
        console.log(`${key}`);
        console.log(value)
        if (value.constructor === ([]).constructor) {
            query = { ...query, [key]: { "$in": value } }
        } else {
            query = { ...query, [key]: value }
        }
    }
    return query
}

function getProject({ projectName, repoUrl }) {
    return new Promise(function (resolve, reject) {
        var key = ''
        var value = ''
        if (projectName) {
            key = 'projectName'
            value = projectName
        } else if (repoUrl) {
            key = 'repoUrl'
            value = repoUrl
        }

        models.PROJECT_MODEL.find({ [key]: value }, function (err, projects) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                if (projects.length === 0) {
                    reject({ response: { status: 404 }, message: `No project with ${key} ${value}` })
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

function getSearchResults(searchTerm) {
    //TODO: Fix the ^ --> Means only the exact word, should be something like contains or similar...
    return new Promise(function (resolve, reject) {
        models.WORDS_SCHEMA
            .find({ _id: searchTerm }, function (err, docs) {
                if (err) {
                    reject(err)
                } else {
                    if (docs[0]) {
                        const documentsToFetch = docs[0].value.documents || []
                        const documentFetchPromises = documentsToFetch.map((attribute) => {
                            const result = models.PROJECT_MODEL.findById(attribute)
                                .then(project => project)
                                .catch(err => reject(err))
                            return result
                        })
                        Promise.all(documentFetchPromises)
                            .then(projects => resolve(projects))
                            .catch(err => reject(err))
                    } else {
                        resolve([])
                    }

                }
            })
    })
}

function getSuggestionList(searchTerm) {
    const regex = new RegExp(".*" + searchTerm + ".*")
    return new Promise(function (resolve, reject) {
        models.WORDS_SCHEMA
            .find({ _id: regex }, function (err, docs) {
                if (err) {
                    reject(err)
                } else {
                    const suggestions = docs.map((doc) => doc["_id"])
                    resolve(suggestions)
                }
            })
    })
}

//Set one of the parameters and the stripData parameter
function getUser({ token, mail, username, activationToken, stripData = true }) {
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
    } else if (activationToken) {
        key = "activationToken"
        value = activationToken
    }

    var findUserRequest = User.findOne({ [key]: value });
    if (stripData) {
        const select = activationToken
            ? "username mail name organization activationToken activated"
            : "username mail name organization profilePicture"
        findUserRequest = findUserRequest.select(select);
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

function updateUser(token, { mailChange, organizationChange, nameChange, profileImagePath }) {
    return new Promise((resolve, reject) => {
        if (!mailChange && !organizationChange && !nameChange && !profileImagePath) {
            resolve(true)
        } else {
            getUser({ token }).then((user) => {
                if (mailChange) {
                    user.mail = mailChange
                }
                if (organizationChange) {
                    user.organization = organizationChange
                }
                if (nameChange) {
                    user.name = nameChange
                }
                if (profileImagePath) {
                    const profileImageData = io.getProfileImageOrDefaultData(profileImagePath)
                    user.profilePicture = {
                        data: profileImageData,
                        contentType: "image/png"
                    }
                }
                user.save(function (err) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                });
                resolve(true)
            })
        }
    })
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


function saveUserToDB({ username, password, name, mail, organization, profileImagePath, lastSessionToken }) {
    const profileImageData = io.getProfileImageOrDefaultData(profileImagePath)
    //TODO: Generate hash instead of math.random
    const activationToken = Math.floor((Math.random() * 100000) + 54)
    const newUserWithProfileImage = models.USER_MODEL({
        username,
        password,
        name,
        mail,
        organization,
        profilePicture: { data: profileImageData, contentType: "image/png" },
        lastSessionToken,
        activationToken,
        activated: false
    });
    const newUserWithoutProfileImage = models.USER_MODEL({
        username,
        password,
        name,
        mail,
        organization,
        lastSessionToken,
        activationToken,
        activated: false
    });

    const userToCreate = profileImageData
        ? newUserWithProfileImage
        : newUserWithoutProfileImage

    return new Promise(function (resolve, reject) {
        userToCreate.save(function (err, newUser) {
            if (profileImageData) {
                io.deleteProfileImageFromHardDrive(profileImagePath)
            }
            if (err) {
                console.log(err);
                reject(err)

            } else {
                console.log(newUser);
                console.log("Saved to DB");
                mail_package.sendVerificationMail(activationToken, mail)
                    .then(() => { resolve(true) })
                    .catch((err) => reject(err))
            }
        });
    });
}

function checkIfUserIsActivated({ mail }) {
    return new Promise(function (resolve) {
        getUser({ mail, stripData: false })
            .then(user => {
                if (user) {
                    resolve(user.activated)
                } else {
                    resolve(false)
                }
            })
            .catch(() => resolve(false))
    })
}

function activateUser(activationToken) {
    return new Promise(function (resolve, reject) {
        getUser({ activationToken })
            .then((user) => {
                if (user) {
                    if (user.activationToken === activationToken && !user.activated) {
                        user.activated = true
                        user.activationToken = undefined
                        user.save(function (err) {
                            if (err) {
                                console.log(err)
                                reject(err)
                            } else {
                                resolve({ activated: true })
                            }
                        })
                    } else {
                        reject({ activated: false, response: { code: 401 }, message: "User was already activated" })
                    }
                } else {
                    reject({ activated: false, response: { code: 404 }, message: "User was not found" })
                }
            })
            .catch(err => reject({ activated: false, response: { code: 404 }, message: "User was not found" }))
    })
}

function saveProjectToDB(projectData) {
    return new Promise(function (resolve, reject) {
        if (mandatoryFieldsExist(projectData)) {
            //TODO: This does not look very Code.json compliant - Check it!
            const newProject = models.PROJECT_MODEL({
                ...projectData,
                date: {
                    created: projectData.dateCreated,
                    lastModified: projectData.dateLastModified
                },
                creatorName: projectData.creatorName || "scraped-by-robo"
            })
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
        } else {
            reject({ code: 422, error: "Not all required fields were processed: " + getMissingFields(projectData) })
        }
    });
}

function mandatoryFieldsExist(projectData) {
    return projectData.projectName && projectData.projectDescription && projectData.organization && projectData.repoUrl && projectData.creatorName
}

function getMissingFields(projectData) {
    var missing = []
    if (!projectData.projectName) {
        missing.push("projectName")
    }
    if (!projectData.projectDescription) {
        missing.push("projectDescription")
    }
    if (!projectData.organization) {
        missing.push("organization")
    }
    if (!projectData.repoUrl) {
        missing.push("repoUrl")
    }
    if (!projectData.creatorName) {
        missing.push("creatorName")
    }
    return missing
}

function mapProjects() {
    // We need to save this in a local var as per scoping problems
    var document = this;

    // You need to expand this according to your needs
    var stopwords = ["the", "this", "and", "or", "/", ""];

    const isValidUrl = (url) => {
        const regEx = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return regEx.test(url)
    }

    const escapeRegExp = (stringToGoIntoTheRegex) => {
        return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.,()|[\]{}]/g, '\\$&');
    }

    for (var prop in document) {
        // We are only interested in strings and explicitly not in _id
        if (prop === "_id" || typeof document[prop] !== 'string') {
            continue
        }

        (document[prop]).split(" ").forEach(
            function (word) {
                var cleaned = word
                const symbolsToRemove = [
                    " ", ";", "(", ")", "#",
                    "\'", "=", "\`", "\'", "*",
                    ">", "<", "!", "\"", "\n",
                    "[", "]", ",", "´"
                ]

                symbolsToRemove.forEach(symbol => {
                    if (symbol === "\n") {
                        cleaned = cleaned.replace(/\r?\n|\r/g, "")
                    } else {
                        const regex = RegExp(escapeRegExp(symbol))
                        cleaned = cleaned.replace(regex, "")
                    }
                })

                cleaned = cleaned.toLowerCase()

                if (isValidUrl(cleaned) || cleaned.startsWith("http://")) {
                    return
                }

                const potentialUrlSymbols = [".", ":", "?", "/"]
                potentialUrlSymbols.forEach(symbol => {
                    if (symbol === ".") {
                        //Only remove at the end of the word to not break any domains abbrevs. etc.
                        cleaned = cleaned.replace(/\.+$/, "")
                    }
                    else {
                        const regex = RegExp(escapeRegExp(symbol))
                        cleaned = cleaned.replace(regex, "")
                    }
                })

                if (
                    stopwords.indexOf(cleaned) > -1 ||
                    !(isNaN(parseInt(cleaned))) ||
                    !(isNaN(parseFloat(cleaned))) ||
                    cleaned.length <= 1
                ) {
                    return
                } else {
                    emit(cleaned, document._id)
                }
            }
        )
    }
}

function reduceProjects(k, v) {
    var values = { 'documents': [] };
    v.forEach(
        function (vs) {
            //Keep it idempotent
            if (vs.constructor === ({}).constructor) {
                // vs.documents.forEach(function (doc) {
                //     if (values.documents.indexOf(doc) === -1) {
                //         values.documents.push(doc)
                //     }
                // })
            } else {
                if (values.documents.indexOf(vs) === -1) {
                    values.documents.push(vs)
                }
            }
        }
    )
    return values
}

function finalizeProjects(key, reducedValue) {

    // First, we ensure that each resulting document
    // has the documents field in order to unify access
    var finalValue = { documents: [] }

    // Second, we ensure that each document is unique in said field
    if (reducedValue.documents) {

        // We filter the existing documents array
        finalValue.documents = reducedValue.documents.filter(

            function (item, pos, self) {

                // The default return value
                var loc = -1;

                for (var i = 0; i < self.length; i++) {
                    // We have to do it this way since indexOf only works with primitives

                    if (self[i].valueOf() === item.valueOf()) {
                        // We have found the value of the current item...
                        loc = i;
                        //... so we are done for now
                        break
                    }
                }

                // If the location we found equals the position of item, they are equal
                // If it isn't equal, we have a duplicate
                return loc === pos;
            }
        );
    } else {
        finalValue.documents.push(reducedValue)
    }
    // We have sanitized our data, now we can return it        
    return finalValue
}


function indexProjects() {
    var o = {}
    o.map = mapProjects
    o.reduce = reduceProjects
    o.finalize = finalizeProjects
    o.out = "words"

    models.PROJECT_MODEL.mapReduce(
        o,
        function (err, results) {
            if (err) {
                console.log(err)
                throw err
            };
            if (results) {
                console.log(results)
            }
        });
}



module.exports = {
    userExists,
    getAllProjects,
    userAndHashExistInDB,
    saveUserToDB,
    saveProjectToDB,
    connectToDb,
    updateSessionToken,
    getUser,
    getProject,
    getProjectsOfUser,
    projectExists,
    updateProjectReadme,
    getProjectChunk,
    indexProjects,
    getSuggestionList,
    getSearchResults,
    updateUser,
    activateUser,
    checkIfUserIsActivated
}