import { createSlice } from '@reduxjs/toolkit'

const projectOverviewSlice = createSlice({
    name: "projectOverview",
    initialState: {
        projects: [],
        isLoading: false,
        error: {
            code: null,
            message: null
        },
        currentFilters: {},
        moreChunkToLoad: true,
    },
    reducers: {
        addFilter: (state, action) => {
            const payload = action.payload;
            const filter = payload.filter;
            const updated = {
                ...state,
                currentFilters: { ...state.currentFilters, [filter.filterKey]: filter.filterValue }
            }
            return updated
        },
        removeFilter: (state, action) => {
            const payload = action.payload;
            const filterKey = payload.filterKey
            const currentClone = Object.assign({}, state.currentFilters)
            delete currentClone[filterKey]
            const updated = {
                ...state,
                currentFilters: currentClone
            }
            return updated
        },
        resetFilters: (state) => {
            return {
                ...state,
                currentFilters: {}
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
            const moreToLoad = !(payload.projects.length < payload.itemsPerLoad)
            const shouldConcat = payload.shouldConcatResults || false
            const updated = {
                ...state,
                projects: shouldConcat ? state.projects.concat(payload.projects) : payload.projects,
                isLoading: false,
                moreChunkToLoad: moreToLoad
            }
            return updated
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
    loadFilteredData_BEGIN,
    loadFilteredData_SUCCESS,
    loadFilteredData_FAILURE,
    addFilter,
    removeFilter,
    resetFilters
} = projectOverviewSlice.actions

export default projectOverviewSlice;