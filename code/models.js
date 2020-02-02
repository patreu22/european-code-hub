const mongoose = require('mongoose');

const USER_SCHEMA = new mongoose.Schema({
    username: String,
    password: String,
    mail: String,
    position: String,
    profilePicture: { data: Buffer, contentType: String },
    lastSessionToken: { type: String, default: '' },
}, { collection: 'users' });

//Status: "released" | "development" | "deprecated" | "archival"
const PROJECT_SCHEMA = new mongoose.Schema({
    projectName: String,
    projectDescription: String,
    organization: String,
    contact: {
        name: String,
        email: String,
    },
    date: {
        created: String,
        lastModified: String
    },
    repoUrl: String,
    programmingLanguages: [String],
    readme: String,
    license: String,
    version: String,
    status: String
}, { collection: 'projects' });


const WORDS_SCHEMA = new mongoose.Schema({
    _id: String,
    value: {
        documents: Array
    },
}, { collection: 'words' });

module.exports = {
    USER_MODEL: new mongoose.model('User', USER_SCHEMA),
    PROJECT_MODEL: new mongoose.model('Project', PROJECT_SCHEMA),
    WORDS_SCHEMA: new mongoose.model('Words', WORDS_SCHEMA)
}