import * as axios from 'axios';
import { fetchProjectData_BEGIN, fetchProjectData_SUCCESS, fetchProjectData_FAILURE } from '../slices/projectOverviewSlice'
import { sendProject_BEGIN, sendProject_SUCCESS, sendProject_FAILURE } from '../slices/createProjectSlice'

export function getAllProjects() {
    return function (dispatch) {
        dispatch(fetchProjectData_BEGIN)
        axios.get('/api/get/projects')
            .then(response => {
                dispatch(fetchProjectData_SUCCESS({ projects: response.data }))
            })
            .catch(err => {
                dispatch(fetchProjectData_FAILURE({ errorCode: err.response.status, errorMessage: err.message }))
            })
    }
}

export function sendNewProjectToBackend(projectData) {
    return function (dispatch) {
        dispatch(sendProject_BEGIN())
        axios.post('/api/create/project', {
            projectData: projectData,
        }).then(function () {
            dispatch(sendProject_SUCCESS())
            //TODO: Redirect to new project page?
            //TODO: Handle Error 202 - Accepted but could not be processed
        }).catch(function (err) {
            dispatch(sendProject_FAILURE({ errorCode: err.response.status, errorMessage: err.message }))
        });
    }
}
