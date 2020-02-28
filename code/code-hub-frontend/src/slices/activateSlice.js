import { createSlice } from '@reduxjs/toolkit'

const defaultState = {
    isLoading: false,
    error: {},
    activated: false
}

const activateSlice = createSlice({
    name: "activate",
    initialState: defaultState,
    reducers: {
        activate_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        activate_SUCCESS: (state) => {
            const updated = {
                ...state,
                isLoading: false,
                activated: true
            }
            return updated
        },
        activate_FAILURE: (state, action) => {
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
    activate_BEGIN,
    activate_SUCCESS,
    activate_FAILURE,
    resetToDefaultState
} = activateSlice.actions

export default activateSlice;