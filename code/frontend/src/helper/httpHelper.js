import * as axios from 'axios';

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