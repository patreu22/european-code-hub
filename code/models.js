const mongoose = require('mongoose');

const USER_SCHEMA = new mongoose.Schema({
    username: String,
    password: String,
    mail: String,
    position: String
}, { collection: 'users' });

const PROJECT_SCHEMA = new mongoose.Schema({
    gitUrl: String,
    projectName: String,
    responsibleInstitution: String,
    contactMail: String
}, { collection: 'projects' });

module.exports = {
    USER_MODEL: new mongoose.model('User', USER_SCHEMA),
    PROJECT_MODEL: new mongoose.model('Project', PROJECT_SCHEMA)
}