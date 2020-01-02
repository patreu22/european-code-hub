import * as axios from 'axios';

export function registerUser(username, password, mail, position) {
    console.log("Let's create a user!")
    axios.post('/api/create/user', {
        username: username,
        password: password,
        mail: mail,
        position: position
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}

export function registerProject({ gitUrl, projectName, projectDescription, contactMail }) {
    axios.post('/api/create/project', {
        gitUrl: gitUrl,
        projectName: projectName,
        projectDescription: projectDescription,
        contactMail: contactMail
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}

export async function requestLoginToken(mail, password) {
    const response = await axios.post('/api/create/token', {
        mail: mail,
        password: password,
    })

    return new Promise(resolve => {
        resolve(response.data)
    });
}

export async function getAllProjects() {
    const response = await axios.get('/api/get/projects')
    //TODO: Remove sleep
    await sleep(2000)
    return new Promise(resolve => {
        resolve({ projects: response.data })
    });
}

//TODO: Remove sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}