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
        currentFilters: {},
        moreChunkToLoad: true,
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
        loadAdditionalProjectData_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        addFilter: (state, action) => {
            const payload = action.payload;
            const filter = payload.filter;
            const updated = {
                ...state,
                currentFilters: { ...state.currentFilters, [filter.filterKey]: filter.filterValue }
            }
            return updated
        },
        loadAdditionalProjectData_SUCCESS: (state, action) => {
            const payload = action.payload;
            const moreToLoad = !(payload.projects.length === 0)
            const updated = {
                ...state,
                projects: state.projects.concat(payload.projects),
                moreChunkToLoad: moreToLoad,
                isLoading: false
            }
            return updated
        },
        loadAdditionalProjectData_FAILURE: (state, action) => {
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
        loadFilteredData_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        loadFilteredData_SUCCESS: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                projects: payload.projects,
                isLoading: false
            }
        },
        loadFilteredData_FAILURE: (state, action) => {
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
    fetchProjectData_FAILURE,
    loadAdditionalProjectData_BEGIN,
    loadAdditionalProjectData_SUCCESS,
    loadAdditionalProjectData_FAILURE,
    loadFilteredData_BEGIN,
    loadFilteredData_SUCCESS,
    loadFilteredData_FAILURE,
    addFilter
} = projectOverviewSlice.actions

export default projectOverviewSlice;