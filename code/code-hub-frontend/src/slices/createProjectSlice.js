import { createSlice } from '@reduxjs/toolkit'

const defaultAddProjectPageContent = {
    pageTitle: "Add a new project",
    contentType: "choose",
}

const defaultAddProjectCurrentStep = 0

const defaultState = {
    projectData: {},
    addProjectCurrentStep: defaultAddProjectCurrentStep,
    addProjectPageContent: defaultAddProjectPageContent,
    isLoading: false,
    successfullySubmitted: false

}

const createProjectSlice = createSlice({
    name: "createProject",
    initialState: defaultState,
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
            const key = payload.key
            const keyPair = key.split(".")
            if (keyPair.length === 1) {
                const updated = {
                    ...state,
                    projectData: {
                        ...state.projectData,
                        [payload.key]: payload.value
                    }
                }
                return updated;
            } else if (keyPair.length === 2) {
                const outerKey = keyPair[0]
                const innerKey = keyPair[1]
                const updated = {
                    ...state,
                    projectData: {
                        ...state.projectData,
                        [outerKey]: {
                            ...state.projectData[outerKey],
                            [innerKey]: payload.value
                        }
                    }
                }
                return updated;
            } else {
                return state
            }
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
        resetToDefaultState: () => {
            return defaultState
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
    sendProject_BEGIN,
    sendProject_SUCCESS,
    sendProject_FAILURE,
    resetToDefaultState

} = createProjectSlice.actions

export default createProjectSlice;