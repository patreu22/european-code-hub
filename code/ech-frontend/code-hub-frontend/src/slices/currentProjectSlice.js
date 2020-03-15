import { createSlice } from '@reduxjs/toolkit'

const defaultState = {
    currentProject: {},
    isLoading: false,
}

const currentProjectSlice = createSlice({
    name: "currentProject",
    initialState: defaultState,
    reducers: {
        fetchProjectByName_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        fetchProjectByName_SUCCESS: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                currentProject: payload.project,
                isLoading: false
            }
        },
        fetchProjectByName_FAILURE: (state, action) => {
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
        resetToDefaultState: (state) => {
            return defaultState
        }
    }
})

export const {
    fetchProjectByName_BEGIN,
    fetchProjectByName_SUCCESS,
    fetchProjectByName_FAILURE,
    resetToDefaultState
} = currentProjectSlice.actions

export default currentProjectSlice;