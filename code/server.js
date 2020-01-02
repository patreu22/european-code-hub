const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require('./models');
const authentication = require('./authentication')

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
        projectDescription: project.projectDescription,
        contactMail: project.contactMail,
        res: res
    })
})

app.post('/api/create/user', function (req, res) {
    const user = req.body;
    const hash = authentication.getPasswordHash(user.password)
    saveUserToDB({
        username: user.username,
        password: hash,
        mail: user.mail,
        position: user.position,
        res: res
    });
});

app.get('/api/get/projects', function (req, res) {
    models.PROJECT_MODEL.find({}, function (err, docs) {
        console.log("Request")
        if (err) {
            console.log(err)
        } else {
            return res.send(docs)
        }
    });
});

app.post('/api/create/token', async function (req, res) {
    const authValues = req.body;
    const pairExists = await userAndHashExistInDB({ mail: authValues.mail, password: authValues.password })
    if (pairExists) {
        const token = authentication.generateWebtoken(authValues.mail, authValues.password)
        return res.status(200).send(token)
    } else {
        return res.status(500).json({ error: "Not Authorized" });
    }
});

app.listen(process.env.PORT || 5000, function () {
    console.log(`Serving on port ${process.env.PORT || 5000}`);
});

async function userAndHashExistInDB({ mail, password }) {
    const User = models.USER_MODEL;
    const user = await User.findOne({ 'mail': mail })

    const hash = user ? user.password : "-1"
    const isCorrect = await authentication.checkPassword(password, hash)

    return new Promise(resolve => {
        resolve(isCorrect)
    });
}


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
function saveProjectToDB({ gitUrl, projectName, projectDescription, contactMail, res }) {
    const newProject = models.PROJECT_MODEL({
        gitUrl: gitUrl,
        projectName: projectName,
        projectDescription: projectDescription,
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