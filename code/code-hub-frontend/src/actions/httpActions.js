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
    setVerificationCookie
} from '../slices/userSlice'


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

export function setVerificationCookieAndProfileImageInStore(token) {
    return function (dispatch) {
        console.log("Lets go!")
        // dispatch(fetchProjectByName_BEGIN())
        //TODO: Set Cookie and Profile Picture!
        dispatch(setVerificationCookie({ cookie: token }))
        const options = {
            method: 'GET',
            headers: { Authorization: token },
            url: '/api/get/user/profileImage',
        }

        //TODO: catch
        axios(options)
            .then(response => dispatch(fetchProfilePicture_SUCCESS({ profilePicture: response.data })))
            .catch(err => dispatch(fetchProjectByName_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
    }
}
