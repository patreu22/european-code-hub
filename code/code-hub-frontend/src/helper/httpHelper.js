import * as axios from 'axios';
import { getPasswordHash } from './passwordHelper';

export function registerUser(username, password, mail, position) {
    console.log("Let's create a user!")
    const hash = getPasswordHash(password);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);

    axios.post('/api/create/user', {
        username: username,
        hash: hash,
        mail: mail,
        position: position
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}

export function registerProject(gitUrl, projectName, projectDescription, responsibleInstitution, contactMail) {
    console.log("Let's create a project!")
    axios.post('/api/create/project', {
        gitUrl: gitUrl,
        projectName: projectName,
        projectDescription: projectDescription,
        responsibleInstitution: responsibleInstitution,
        contactMail: contactMail
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}