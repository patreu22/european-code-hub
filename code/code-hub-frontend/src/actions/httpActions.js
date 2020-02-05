import * as axios from 'axios';
import { getVerificationToken } from '../helper/cookieHelper'
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
    fetchProfilePicture_SUCCESS,
    fetchProfilePicture_FAILURE,
    fetchUserData_BEGIN,
    fetchUserData_SUCCESS,
    fetchUserData_FAILURE,
    fetchOwnUserData_BEGIN,
    fetchOwnUserData_SUCCESS,
    fetchOwnUserData_FAILURE,
    setVerificationCookie
} from '../slices/userSlice'
import { getOwnUserData } from '../helper/httpHelper'


export function getFilteredProjects(filters, currentPage, shouldConcatResults) {
    return function (dispatch) {
        const itemsPerLoad = 20
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

export function sendNewProjectToBackend(projectData) {
    return function (dispatch) {
        dispatch(sendProject_BEGIN())
        //TODO: Redirect to new project page?
        //TODO: Handle Error 202 - Accepted but could not be processed
        axios.post('/api/create/project', { projectData: projectData })
            .then(() => dispatch(sendProject_SUCCESS()))
            .catch((err) => dispatch(sendProject_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

//TODO: Remove all getVerificationToken() functions and use Redux
export function getProjectByName(projectName) {
    return function (dispatch) {
        dispatch(fetchProjectByName_BEGIN())
        const options = {
            method: 'GET',
            headers: { Authorization: getVerificationToken() },
            url: '/api/get/project',
            params: { projectName }
        }

        axios(options)
            .then(response => dispatch(fetchProjectByName_SUCCESS({ project: response.data })))
            .catch(err => dispatch(fetchProjectByName_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

//TODO: Change to username on server
export function getUserByName(username) {
    console.log("By Name! Name: " + username)
    return function (dispatch) {
        const options = {
            method: 'GET',
            url: '/api/get/user',
            params: {
                username: username
            }
        }

        dispatch(fetchUserData_BEGIN())

        axios(options)
            .then(response => dispatch(fetchUserData_SUCCESS({ userData: response.data })))
            .catch(err => dispatch(fetchUserData_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))

    }
}

export function getUserByToken(token) {
    console.log("By token! Token: " + token)
    return function (dispatch) {
        const options = {
            method: 'GET',
            headers: { Authorization: token },
            url: '/api/get/user',
        }
        console.log("HOLA!")
        dispatch(fetchOwnUserData_BEGIN())

        axios(options)
            .then(response => dispatch(fetchOwnUserData_SUCCESS({ userData: response.data })))
            .catch(err => dispatch(fetchOwnUserData_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}

export function setVerificationCookieAndProfileImageInStore(token) {
    return function (dispatch) {
        const options = {
            method: 'GET',
            headers: { Authorization: token },
            url: '/api/get/user/'
        }

        dispatch(setVerificationCookie({ cookie: token }))

        axios(options)
            .then(response => dispatch(fetchProfilePicture_SUCCESS({ profilePicture: response.data.profilePicture.data.data })))
            .catch(err => dispatch(fetchProfilePicture_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}
