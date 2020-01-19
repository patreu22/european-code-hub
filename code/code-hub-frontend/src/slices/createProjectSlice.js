import { createSlice } from '@reduxjs/toolkit'

const defaultAddProjectPageContent = {
    pageTitle: "Add a new project",
    contentType: "choose",
}

const defaultAddProjectCurrentStep = 0

const createProjectSlice = createSlice({
    name: "createProject",
    initialState: {
        projectData: {},
        addProjectCurrentStep: defaultAddProjectCurrentStep,
        addProjectPageContent: defaultAddProjectPageContent,
        isLoading: false,
        successfullySubmitted: false

    },
    reducers: {
        setProjectData: (state, action) => {
            const payload = action.payload;
            const updated = {
                ...state,
                projectData: payload.projectData
            }
            return updated;
        },
        updateProjectDataAttribute: (state, action) => {
            const payload = action.payload;
            const updated = {
                ...state,
                projectData: {
                    ...state.projectData,
                    [payload.key]: payload.value
                }
            }
            return updated;
        },
        incrementSteps: (state) => {
            const updated = {
                ...state,
                addProjectCurrentStep: state.addProjectCurrentStep + 1
            }
            return updated;
        },
        resetSteps: (state) => {
            const updated = {
                ...state,
                addProjectCurrentStep: 0
            }
            return updated;
        },
        resetAddProjectPage: (state) => {
            const updated = {
                ...state,
                addProjectCurrentStep: defaultAddProjectCurrentStep,
                addProjectPageContent: defaultAddProjectPageContent
            }
            return updated;
        },
        updateAddProjectPageContent: (state, action) => {
            const payload = action.payload;
            const updated = {
                ...state,
                addProjectPageContent: {
                    pageTitle: payload.pageTitle,
                    contentType: payload.contentType
                }
            }
            return updated;
        },
        sendProject_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        sendProject_SUCCESS: (state, action) => {
            return {
                ...state,
                isLoading: false,
                successfullySubmitted: true
            }
        },
        sendProject_FAILURE: (state, action) => {
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
    setProjectData,
    incrementSteps,
    resetSteps,
    updateAddProjectPageContent,
    updateProjectDataAttribute,
    resetAddProjectPage,
    sendProject_BEGIN,
    sendProject_SUCCESS,
    sendProject_FAILURE

} = createProjectSlice.actions

export default createProjectSlice;