import { createSlice } from '@reduxjs/toolkit'

const defaultState = {
    isLoading: false,
    error: {
        code: null,
        message: null
    },
    verified: false
}

const searchSlice = createSlice({
    name: "verify",
    initialState: defaultState,
    reducers: {
        verify_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        verify_SUCCESS: (state) => {
            const updated = {
                ...state,
                isLoading: false,
                verified: true
            }
            return updated
        },
        verify_FAILURE: (state, action) => {
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
    verify_BEGIN,
    verify_SUCCESS,
    verify_FAILURE
} = searchSlice.actions

export default searchSlice;