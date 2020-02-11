const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authentication = require('./authentication')
const database = require('./database')
const io = require('./io')

const MONGOOSE_DB_URL = 'mongodb://localhost:27017/code-hub';

const app = express();
const uploadMiddleware = io.getUploadMiddleware();

app.use(express.static(path.join(__dirname, 'code-hub-frontend/build')));
app.use(bodyParser.json());

database.connectToDb(MONGOOSE_DB_URL);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'code-hub-frontend/build/index.html'));
});

app.get('/ping', function (req, res) {
    // database.indexProjects();
    return res.send('pong');
});

app.post('/api/create/project', function (req, res) {
    const projectData = req.body.projectData;
    const creatorName = req.body.creatorName;
    if (projectData) {
        if (projectData.projectName) {
            database.projectExists({ projectName: projectData.projectName })
                .then(projectExists => {
                    if (projectExists) {
                        return res.status(409).send({ errorType: "projectNameExists" })
                    } else {
                        database.saveProjectToDB(projectData, creatorName)
                            .then(response => {
                                if (response.saved) {
                                    io.getRemoteMarkdownFileAsDataString(projectData.repoUrl)
                                        .then(
                                            (markdown) => database.updateProjectReadme(projectData.projectName, markdown)
                                                .then((response) => {
                                                    if (response === true) {
                                                        //200: Accepted
                                                        res.sendStatus(200);
                                                    } else {
                                                        res.sendStatus(400);
                                                    }
                                                })
                                                .catch((err) => {
                                                    console.log(err)
                                                    res.status(err.code || 400).send(err.error || "Undefined Error")
                                                })
                                        )
                                        .catch((err) => {
                                            console.log(err)
                                            if (err.code === 404) {
                                                //Means the Readme file was not found/provided, but project was saved anyway
                                                res.sendStatus(200)
                                            } else {
                                                res.status(err.code || 400).send(err.error || "Undefined Error")
                                            }
                                        })
                                } else {
                                    //202: Accepted but could not be processed
                                    //TODO: Handle that in frontend - Show error
                                    res.sendStatus(202)
                                }
                            }).catch(err => {
                                //500: Internal Server error
                                res.status(err.code || 500).send(err.error || "Internal Server Error");
                            })
                    }
                })
        } else {
            res.status(422).send("Not all required fields were processed")
        }
    } else {
        res.status(422).send("Not all required fields were processed")
    }
})

app.post('/api/create/user', uploadMiddleware.single('profileImageFile'), (req, res) => {
    const user = req.body;
    database.userExists({ mail: user.mail })
        .then(userMailExists => {
            if (!userMailExists) {
                database.userExists({ username: user.username })
                    .then(userNameExists => {
                        if (!userNameExists) {
                            const profileImagePath = req.file ? req.file.path : null;
                            const hash = authentication.getPasswordHash(user.password)
                            database.saveUserToDB({
                                username: user.username,
                                password: hash,
                                mail: user.mail,
                                organization: user.organization,
                                profileImagePath: profileImagePath,
                            }).then(savedUser => {
                                if (savedUser) {
                                    res.sendStatus(200);
                                } else {
                                    res.sendStatus(500);
                                }
                            }).catch(err => {
                                console.log(err)
                                res.sendStatus(500)
                            });
                        } else {
                            return res.status(400).send({ errorType: "usernameExists" });
                        }
                    })
            } else {
                //400: Bad Request
                //TODO: Handle to show error message
                return res.status(400).send({ errorType: "mailExists" });
            }
        });
});

app.get('/api/get/project', function (req, res) {
    const projectName = req.query.projectName;
    database.getProjectByName(projectName)
        .then(projects => res.status(200).send(projects))
        .catch((err) => { res.sendStatus(err.response.status) })
});

app.get('/api/get/projects/', function (req, res) {
    const resultsToSkip = req.query.resultsToSkip;
    const itemsPerLoad = req.query.itemsPerLoad;
    const filters = req.query.filters;
    database.getProjectChunk(JSON.parse(filters || '{}'), parseInt(resultsToSkip), parseInt(itemsPerLoad))
        .then(projects => res.status(200).send(projects))
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
});

app.get('/api/get/autocomplete', function (req, res) {
    const searchTerm = req.query.searchTerm;
    database.getSuggestionList(searchTerm)
        .then(suggestions => res.status(200).send(suggestions))
        .catch((err) => {
            console.log("Error!")
            console.log(err)
            res.sendStatus(400)
        })
})

app.get('/api/get/searchResults', function (req, res) {
    const searchTerm = req.query.searchTerm;
    database.getSearchResults(searchTerm)
        .then(results => res.status(200).send(results))
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
})

//Returns either user by username query or own data by auth token
app.get('/api/get/user', function (req, res) {
    const username = req.query.username
    const authHeader = req.headers.authorization

    if (!username && !authHeader) {
        return res.status(404).send({ msg: "Neither username nor auth token provided" });
    } else {
        const request = username
            ? database.getUser({ username, stripData: true })
            : database.getUser({ token: authHeader, stripData: true })

        request
            .then(user => {
                if (user) {
                    return res.status(200).send(user)
                } else {
                    return res.status(404).send({ msg: "No user found" });
                }
            })
            .catch(() => {
                return res.sendStatus(400);
            })
    }
});


app.post('/api/create/token', function (req, res) {
    const authValues = req.body;
    database.userAndHashExistInDB({ mail: authValues.mail, password: authValues.password }).then(pairExists => {
        if (pairExists) {
            const token = authentication.generateWebtoken()
            database.updateSessionToken({ mail: authValues.mail, token: token })
            return res.status(200).send(token)
        } else {
            return res.sendStatus(400);
        }
    })
});

app.get('/api/get/user/profileImage', function (req, res) {
    const authHeader = req.headers.authorization
    database.getUser({ token: authHeader })
        .then((user) => res.status(200).contentType(user.profilePicture.contentType).send(user.profilePicture.data))
        .catch(() => {
            console.log("No user found");
            return res.sendStatus(404)
        });
});

app.listen(process.env.PORT || 5000, function () {
    console.log(`Serving on port ${process.env.PORT || 5000}`);
});