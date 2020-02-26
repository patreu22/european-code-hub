import * as axios from 'axios';
import {
    loadFilteredData_BEGIN,
    loadFilteredData_SUCCESS,
    loadFilteredData_FAILURE
} from '../slices/projectOverviewSlice'
import {
    sendProject_BEGIN,
    sendProject_SUCCESS,
    sendProject_FAILURE
} from '../slices/createProjectSlice'
import {
    fetchProjectByName_BEGIN,
    fetchProjectByName_SUCCESS,
    fetchProjectByName_FAILURE
} from '../slices/currentProjectSlice'
import {
    getSearchResults_BEGIN,
    getSearchResults_SUCCESS,
    getSearchResults_FAILURE
} from '../slices/searchSlice'
import {
    fetchProfilePictureAndUsername_SUCCESS,
    fetchProfilePictureAndUsername_FAILURE,
    fetchUserData_BEGIN,
    fetchUserData_SUCCESS,
    fetchUserData_FAILURE,
    fetchOwnUserData_BEGIN,
    fetchOwnUserData_SUCCESS,
    fetchOwnUserData_FAILURE,
    setVerificationCookie,
    resetVerificationCookie,
    fetchUserProjects_BEGIN,
    fetchUserProjects__SUCCESS,
    fetchUserProjects_FAILURE,
} from '../slices/userSlice'
import store from '../store'
import { removeVerificationToken } from '../helper/cookieHelper'


export function getFilteredProjects(filters, currentPage, shouldConcatResults) {
    return function (dispatch) {
        const itemsPerLoad = 80
        const resultsToSkip = (currentPage - 1) * itemsPerLoad
        dispatch(loadFilteredData_BEGIN())
        const options = {
            method: 'GET',
            url: '/api/get/projects',
            params: {
                filters,
                resultsToSkip,
                itemsPerLoad
            }
        }
        //TODO: Handle error
        axios(options)
            .then(response => dispatch(loadFilteredData_SUCCESS({ projects: response.data, shouldConcatResults, itemsPerLoad })))
            .catch(err => dispatch(loadFilteredData_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

export function getSearchResults(searchTerm, currentPage, shouldConcatResults) {
    return function (dispatch) {
        const itemsPerLoad = 20
        const resultsToSkip = (currentPage - 1) * itemsPerLoad
        dispatch(getSearchResults_BEGIN())
        const options = {
            method: 'GET',
            url: '/api/get/searchResults',
            params: {
                searchTerm,
                resultsToSkip,
                itemsPerLoad
            }
        }

        axios(options)
            .then(response => dispatch(getSearchResults_SUCCESS({ projects: response.data, shouldConcatResults, itemsPerLoad })))
            .catch(err => dispatch(getSearchResults_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

export function sendNewProjectToBackend(projectData, token) {
    return function (dispatch) {
        dispatch(sendProject_BEGIN())
        //TODO: Handle Error 202 - Accepted but could not be processed
        const redux = store.getState()
        const options = {
            method: 'POST',
            headers: { Authorization: token },
            url: '/api/create/project',
            data: {
                projectData: {
                    ...projectData,
                    creatorName: redux.user.username
                }
            }
        }

        axios(options)
            .then(() => dispatch(sendProject_SUCCESS()))
            .catch((err) => dispatch(sendProject_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

export function getProjectByName(projectName) {
    return function (dispatch) {
        dispatch(fetchProjectByName_BEGIN())
        const options = {
            method: 'GET',
            url: '/api/get/project',
            params: { projectName }
        }

        axios(options)
            .then(response => dispatch(fetchProjectByName_SUCCESS({ project: response.data })))
            .catch(err => dispatch(fetchProjectByName_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

export function getUserByName(username) {
    return function (dispatch) {
        const options = {
            method: 'GET',
            url: '/api/get/user',
            params: {
                username
            }
        }

        dispatch(fetchUserData_BEGIN())

        axios(options)
            .then(response => dispatch(fetchUserData_SUCCESS({ userData: response.data })))
            .catch(err => dispatch(fetchUserData_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))

    }
}

export function getUserProjectsByName(username) {
    return function (dispatch) {
        const options = {
            method: 'GET',
            url: '/api/get/projects',
            params: {
                username
            }
        }

        dispatch(fetchUserProjects_BEGIN())

        axios(options)
            .then(response => dispatch(fetchUserProjects__SUCCESS({ userProjects: response.data })))
            .catch(err => dispatch(fetchUserProjects_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

export function getUserByToken(token) {
    return function (dispatch) {
        const options = {
            method: 'GET',
            headers: { Authorization: token },
            url: '/api/get/user',
        }

        dispatch(fetchOwnUserData_BEGIN())

        axios(options)
            .then(response => {
                if (response.data.profilePicture) {
                    const profileImagePicture = "data:image/png;base64," + btoa(new Uint8Array(response.data.profilePicture.data.data).reduce(function (data, byte) {
                        return data + String.fromCharCode(byte);
                    }, ''));
                    b64toBlob(profileImagePicture)
                        .then((blob) => {
                            const url = window.URL.createObjectURL(blob)
                            const userData = { ...response.data, profilePicture: url }
                            dispatch(fetchOwnUserData_SUCCESS({ userData: userData }))
                        })
                } else {
                    dispatch(fetchOwnUserData_SUCCESS({ userData: response.data }))
                }
            })
            .catch(err => dispatch(fetchOwnUserData_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

export function setVerificationCookieAndProfileImageAndUserNameInStore(token) {
    return function (dispatch) {
        const options = {
            method: 'GET',
            headers: { Authorization: token },
            url: '/api/get/user'
        }

        dispatch(setVerificationCookie({ cookie: token }))

        axios(options)
            .then(response => {
                if (response.data.profilePicture) {
                    const profileImagePicture = "data:image/png;base64," + btoa(new Uint8Array(response.data.profilePicture.data.data).reduce(function (data, byte) {
                        return data + String.fromCharCode(byte);
                    }, ''));
                    b64toBlob(profileImagePicture)
                        .then((blob) => {
                            const url = window.URL.createObjectURL(blob)
                            dispatch(fetchProfilePictureAndUsername_SUCCESS({ profilePicture: url, username: response.data.username }))
                        })
                } else {
                    dispatch(fetchProfilePictureAndUsername_SUCCESS({ profilePicture: null, username: response.data.username }))
                }
            })
            .catch(err => {
                //User-Token outdated: Reset it in Redux and in Browser
                if (err.response) {
                    if (err.response.status === 404) {
                        removeVerificationToken()
                        dispatch(resetVerificationCookie())
                    }
                    dispatch(fetchProfilePictureAndUsername_FAILURE({ errorCode: err.response.status, errorMessage: err.message }))
                } else {
                    console.log("ERROR!")
                    console.log(err)
                }
            })
    }
}

const b64toBlob = (base64) =>
    fetch(`${base64}`).then(res => res.blob())