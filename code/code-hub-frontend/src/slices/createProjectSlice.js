import { createSlice } from '@reduxjs/toolkit'

const defaultAddProjectCurrentStep = 0

const defaultState = {
    projectData: {},
    addProjectCurrentStep: defaultAddProjectCurrentStep,
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
        fetchProjectFromGitRepo_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        fetchProjectFromGitRepo_SUCCESS: (state) => {
            return {
                //TODO: Dispatch all received infos to projectData
                ...state,
                isLoading: false
            }
        },
        fetchProjectFromGitRepo_FAILURE: (state, action) => {
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
        resetError: (state) => {
            return {
                ...state,
                error: {}
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
    fetchProjectFromGitRepo_BEGIN,
    fetchProjectFromGitRepo_SUCCESS,
    fetchProjectFromGitRepo_FAILURE,
    resetToDefaultState,
    resetError
} = createProjectSlice.actions

export default createProjectSlice;