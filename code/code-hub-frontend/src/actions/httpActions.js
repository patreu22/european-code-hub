import * as axios from 'axios';
import { fetchProjectData_BEGIN, fetchProjectData_SUCCESS, fetchProjectData_FAILURE } from '../slices/projectOverviewSlice'

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