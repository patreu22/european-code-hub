import { createSlice } from '@reduxjs/toolkit'

const defaultAddProjectPageContent = {
    isLoading: false,
    projectsToDisplay: []
}

const defaultAddProjectCurrentStep = 0

const projectOverviewSlice = createSlice({
    name: "projectOverview",
    initialState: {
        projects: [],
        error: {
            code: null,
            message: null
        },
        addProjectCurrentStep: defaultAddProjectCurrentStep,
        addProjectPageContent: defaultAddProjectPageContent,
    },
    reducers: {
        fetchProjectData_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        fetchProjectData_SUCCESS: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                projects: payload.projects,
                isLoading: false
            }
        },
        fetchProjectData_FAILURE: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                isLoading: false,
                error: {
                    code: payload.errorCode,
                    message: payload.errorMessage
                }
            }
        },
    }
})

export const {
    fetchProjectData_BEGIN,
    fetchProjectData_SUCCESS,
    fetchProjectData_FAILURE
} = projectOverviewSlice.actions

export default projectOverviewSlice;