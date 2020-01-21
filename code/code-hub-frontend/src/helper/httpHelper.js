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