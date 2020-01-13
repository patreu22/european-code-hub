import * as axios from 'axios';
import { getVerificationToken } from '../helper/cookieHelper'

export function registerUser(username, password, mail, position, profileImageFile) {
    var formData = new FormData();
    formData.append("profileImageFile", profileImageFile);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("mail", mail);
    formData.append("position", position);

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: formData,
        url: '/api/create/user'
    }
    return new Promise((resolve, reject) => {
        axios(options)
            .then(function (response) {
                resolve(response)
            }).catch(function (error) {
                reject(error)
            });
    });
}

export function registerProject({ gitUrl, projectName, projectDescription, contactMail }) {
    return new Promise((resolve, reject) => {
        axios.post('/api/create/project', {
            gitUrl: gitUrl,
            projectName: projectName,
            projectDescription: projectDescription,
            contactMail: contactMail
        }).then(function (response) {
            resolve(true)
            console.log(response);
        }).catch(function (err) {
            reject(err)
            console.log(err);
        });
    })
}

export function requestLoginToken(mail, password) {
    return new Promise((resolve, reject) => {
        axios.post('/api/create/token', {
            mail: mail,
            password: password,
        }).then(response => {
            resolve(response.data)
        }).catch(err => {
            reject(err)
        })
    });
}

export function getOwnUserData() {
    const options = {
        method: 'GET',
        headers: { Authorization: getVerificationToken() },
        url: '/api/get/user/'
    }

    return new Promise((resolve, reject) => {
        axios(options)
            .then(response => resolve(response.data))
            .catch(err => reject(err))
    })
}

export async function getAllProjects() {
    const response = await axios.get('/api/get/projects')
    //TODO: Remove sleep
    await sleep(2000)
    return new Promise(resolve => {
        resolve({ projects: response.data })
    });
}

//TODO: Change to username
export function getUserData({ username }) {
    const options = {
        method: 'GET',
        headers: { Authorization: getVerificationToken() },
        url: '/api/get/user',
        params: {
            username: username
        }
    }

    return new Promise((resolve, reject) => {
        axios(options)
            .then(response => resolve(response.data))
            .catch(err => reject(err))
    })
}

//TODO: Remove sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}