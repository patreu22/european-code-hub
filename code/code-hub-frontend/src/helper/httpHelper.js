import * as axios from 'axios';

export function registerUser(username, password, mail, organization, profileImageFile) {
    var formData = new FormData();
    formData.append("profileImageFile", profileImageFile);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("mail", mail);
    formData.append("organization", organization);

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

export function updateUser(token, fieldsToUpdate) {
    return new Promise((resolve, reject) => {
        var formData = new FormData();
        for (let key in fieldsToUpdate) {
            formData.append(key, fieldsToUpdate[key]);
        }

        const options = {
            method: 'PUT',
            url: '/api/update/user',
            headers: {
                'Authorization': token,
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: formData
        }

        axios(options)
            .then(response => {
                if (response.status === 200) {
                    resolve(true)
                } else { resolve(false) }
            })
            .catch(err => console.log(err))
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

export function getSearchSuggestion(searchTerm) {
    const options = {
        method: 'GET',
        url: '/api/get/autocomplete',
        params: {
            searchTerm
        }
    }

    return new Promise((resolve, reject) => {
        axios(options)
            .then(response => resolve(response.data))
            .catch(err => reject(err))
    })
}