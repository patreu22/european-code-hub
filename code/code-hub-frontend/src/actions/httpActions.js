import * as axios from 'axios';
import { getVerificationToken } from '../helper/cookieHelper'
import {
    fetchProjectData_BEGIN,
    fetchProjectData_SUCCESS,
    fetchProjectData_FAILURE
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


export function getAllProjects() {
    return function (dispatch) {
        dispatch(fetchProjectData_BEGIN)
        axios.get('/api/get/projects')
            .then(response => dispatch(fetchProjectData_SUCCESS({ projects: response.data })))
            .catch(err => dispatch(fetchProjectData_FAILURE({ errorCode: err.response.status, errorMessage: err.message })))
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
