import { createSlice } from '@reduxjs/toolkit'

const defaultState = {
    projects: [],
    isLoading: false,
    error: {
        code: null,
        message: null
    },
    moreChunkToLoad: true,
}

const searchSlice = createSlice({
    name: "search",
    initialState: defaultState,
    reducers: {
        getSearchResults_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        getSearchResults_SUCCESS: (state, action) => {
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
        getSearchResults_FAILURE: (state, action) => {
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
    getSearchResults_BEGIN,
    getSearchResults_SUCCESS,
    getSearchResults_FAILURE,
    resetToDefaultState
} = searchSlice.actions

export default searchSlice;