const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const MONGOOSE_DB_URL = 'mongodb://localhost:27017/code-hub';
const models = require('./models');


app.use(express.static(path.join(__dirname, 'code-hub-frontend/build')));
app.use(bodyParser.json());

mongoose.connect(MONGOOSE_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Welcome to the fabulous MongoDB world!")
});


app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'code-hub-frontend/build/index.html'));
});

app.post('/api/create/project', function (req, res) {
    const project = req.body;
    saveProjectToDB({
        gitUrl: project.gitUrl,
        projectName: project.projectName,
        responsibleInstitution: project.responsibleInstitution,
        contactMail: project.contactMail,
        res: res
    })
})

app.post('/api/create/user', function (req, res) {
    const user = req.body;
    saveUserToDB({
        username: user.username,
        password: user.password,
        mail: user.mail,
        position: user.position,
        res: res
    });
});

app.listen(process.env.PORT || 5000, function () {
    console.log(`Serving on port ${process.env.PORT || 5000}`);
});


function saveUserToDB({ username, password, mail, position, res }) {
    const newUser = models.USER_MODEL({
        username: username,
        password: password,
        mail: mail,
        position: position
    });
    newUser.save(function (err, newUser) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(newUser);
            console.log("Saved to DB");
            res.sendStatus(200);
        }
    });
}

//TODO: Handle duplicates "User already registered"
function saveProjectToDB({ gitUrl, projectName, responsibleInstitution, contactMail, res }) {
    const newProject = models.PROJECT_MODEL({
        gitUrl: gitUrl,
        projectName: projectName,
        responsibleInstitution: responsibleInstitution,
        contactMail: contactMail
    })
    newProject.save(function (err, newProject) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(newProject);
            console.log("Saved to DB");
            res.sendStatus(200);
        }
    });
}

