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
        }
    }
})

export const {
    setProjectData,
    incrementSteps,
    resetSteps,
    updateAddProjectPageContent,
    updateProjectDataAttribute,
    resetAddProjectPage,
} = createProjectSlice.actions

export default createProjectSlice;