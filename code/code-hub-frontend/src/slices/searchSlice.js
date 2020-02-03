import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
    name: "search",
    initialState: {
        projects: [],
        isLoading: false,
        error: {
            code: null,
            message: null
        },
        moreChunkToLoad: true,
    },
    reducers: {
        getSearchResults_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        getSearchResults_SUCCESS: (state, action) => {
            const payload = action.payload;
            const moreToLoad = !(payload.projects.length === 0)
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
    }
})

export const {
    getSearchResults_BEGIN,
    getSearchResults_SUCCESS,
    getSearchResults_FAILURE
} = searchSlice.actions

export default searchSlice;