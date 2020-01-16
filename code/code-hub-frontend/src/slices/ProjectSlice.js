import { createSlice } from '@reduxjs/toolkit'

const defaultAddProjectPageContent = {
    pageTitle: "Add a new project",
    contentType: "choose",
    //contentType: "manually"
}

const defaultAddProjectCurrentStep = 0

const projectSlice = createSlice({
    name: "project",
    initialState: {
        projectData: {},
        addProjectCurrentStep: defaultAddProjectCurrentStep,
        addProjectPageContent: defaultAddProjectPageContent
    },
    reducers: {
        createProject: (state) => {
            return {
                ...state,
            }
        },
        updateProject: (state, action) => {
            const payload = action.payload;
            const updated = {
                ...state,
                update: payload.updateMessage
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
        decrementSteps: (state) => {
            const currentStep = state.addProjectCurrentStep
            const updated = {
                ...state,
                addProjectCurrentStep: currentStep > 0 ? currentStep - 1 : 0
            }
            console.log(updated)
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

// Redux boilerplate code
export const {
    createProject,
    updateProject,
    incrementSteps,
    resetSteps,
    updateAddProjectPageContent,
    decrementSteps,
    resetAddProjectPage
} = projectSlice.actions

export default projectSlice;