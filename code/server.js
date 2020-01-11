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
    const project = req.body;
    database.saveProjectToDB({
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

app.get('/api/get/projects', function (req, res) {
    database.getAllProjects()
        .then(projects => {
            return res.status(200).send(projects)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
});

//Returns own user data based on session token
app.get('/api/get/user/', authentication.isAuthorized, function (req, res) {
    database.getUser({ token: req.headers.authorization, stripData: true })
        .then(user => {
            return res.status(200).send(user)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
});

//Returns public data by username
app.get('/api/get/user/:username', function (req, res) {
    var username = req.params.username;
    console.log(username)
    database.getUser({ username: username, stripData: true })
        .then(user => {
            return res.status(200).send(user)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
});


app.post('/api/create/token', function (req, res) {
    return new Promise(function (resolve, reject) {
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
});

app.get('/api/get/user/profileImage/:mail', async function (req, res) {
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