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
    return res.send('pong');
});

app.post('/api/create/project', function (req, res) {
    const projectData = req.body.projectData;
    database.saveProjectToDB(projectData).then(response => {
        if (response.saved) {
            io.getRemoteMarkdownFileAsDataString(projectData.repoUrl)
                .then((markdown) => database.updateProjectReadme(projectData.projectName, markdown)
                    .then((response) => {
                        if (response === true) {
                            //200: Accepted
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(400);
                        }
                    })
                    .catch((err) => res.sendStatus(400))
                )
                .catch((err) => res.sendStatus(400))
        } else {
            //202: Accepted but could not be processed
            res.sendStatus(202)
        }
    }).catch(error => {
        //500: Internal Server error
        res.sendStatus(500);
    })
})

app.post('/api/create/user', uploadMiddleware.single('profileImageFile'), (req, res) => {
    const user = req.body;
    database.userExists({ mail: user.mail })
        .then(userExists => {
            if (!userExists) {
                const profileImagePath = req.file ? req.file.path : null;
                const hash = authentication.getPasswordHash(user.password)
                database.saveUserToDB({
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

app.get('/api/get/project', function (req, res) {
    const projectName = req.query.projectName;
    database.getProjectByName(projectName)
        .then(projects => res.status(200).send(projects))
        .catch((err) => res.sendStatus(err.code))
});

app.get('/api/get/projects/', function (req, res) {
    database.getAllProjects()
        .then(projects => {
            return res.status(200).send(projects)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
});

//Returns either user by username query or own data by auth token
app.get('/api/get/user', function (req, res) {
    const username = req.query.username
    const authHeader = req.headers.authorization

    if (!username && !authHeader) {
        return res.status(404).send({ msg: "Neither username nor auth token provided" });
    } else {
        //TODO: Change mail to username when username system is established
        const request = username
            ? database.getUser({ mail: username, stripData: true })
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

app.get('/api/get/user/profileImage/:mail', function (req, res) {
    const mail = req.params.mail;
    database.getUser({ mail: mail })
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