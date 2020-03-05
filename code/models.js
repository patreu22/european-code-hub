const mongoose = require('mongoose');

const USER_SCHEMA = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    mail: String,
    organization: String,
    profilePicture: { data: Buffer, contentType: String },
    lastSessionToken: { type: String, default: '' },
    activated: Boolean,
    activationToken: String
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
    status: String,
    creatorName: String
}, { collection: 'projects' });


const PROJECTS_INDEX = new mongoose.Schema({
    _id: String,
    value: {
        documents: Array
    },
}, { collection: 'projectsIndex' });


const LICENSES_INDEX = new mongoose.Schema({
    _id: String,
    value: {
        documents: Array
    },
}, { collection: 'licensesIndex' });

module.exports = {
    USER_MODEL: new mongoose.model('User', USER_SCHEMA),
    PROJECT_MODEL: new mongoose.model('Project', PROJECT_SCHEMA),
    PROJECTS_INDEX: new mongoose.model('ProjectsIndex', PROJECTS_INDEX),
    LICENSES_INDEX: new mongoose.model('LicensesIndex', LICENSES_INDEX)
}