const mongoose = require('mongoose');

const models = require('./models');
const authentication = require('./authentication')
const io = require('./io')

var db;

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

function getSuggestionList(searchTerm) {
    const regex = new RegExp("^" + searchTerm)
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

function mapProjects() {
    // We need to save this in a local var as per scoping problems
    var document = this;

    // You need to expand this according to your needs
    var stopwords = ["the", "this", "and", "or"];

    for (var prop in document) {
        // We are only interested in strings and explicitly not in _id
        if (prop === "_id" || typeof document[prop] !== 'string') {
            continue
        }

        (document[prop]).split(" ").forEach(
            function (word) {
                // You might want to adjust this to your needs
                var cleaned = word.replace(/[;,.]/g, "")

                if (
                    // We neither want stopwords...
                    stopwords.indexOf(cleaned) > -1 ||
                    // ...nor string which would evaluate to numbers
                    !(isNaN(parseInt(cleaned))) ||
                    !(isNaN(parseFloat(cleaned)))
                ) {
                    return
                }
                emit(cleaned, document._id)
            }
        )
    }
}

function reduceProjects(k, v) {
    // Kind of ugly, but works.
    // Improvements more than welcome!
    var values = { 'documents': [] };
    v.forEach(
        function (vs) {
            if (values.documents.indexOf(vs) > -1) {
                return
            }
            values.documents.push(vs)
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
    db.collection("projects").mapReduce(
        mapProjects,
        reduceProjects,
        {
            finalize: finalizeProjects,
            out: "words"
        }
    )
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
    indexProjects: indexProjects,
    getSuggestionList: getSuggestionList
}