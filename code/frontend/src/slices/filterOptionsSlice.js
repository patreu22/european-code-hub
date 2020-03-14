import { createSlice } from '@reduxjs/toolkit'

const defaultState = {
    isLoading: false,
    error: {},
    licenseOptions: [],
    statusOptions: [],
    organizationOptions: [],
    programmingLanguagesOptions: []
}

const filterOptionsSlice = createSlice({
    name: "filterOptions",
    initialState: defaultState,
    reducers: {
        fetchFilterOptions_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        fetchFilterOptions_SUCCESS: (state, action) => {
            const payload = action.payload
            const licenseOptions = payload.licenseOptions || []
            const statusOptions = payload.statusOptions || []
            const organizationOptions = payload.organizationOptions || []
            const programmingLanguagesOptions = payload.programmingLanguagesOptions || []
            const updated = {
                ...state,
                isLoading: false,
                licenseOptions,
                statusOptions,
                organizationOptions,
                programmingLanguagesOptions
            }
            return updated
        },
        fetchFilterOptions_FAILURE: (state, action) => {
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
    fetchFilterOptions_BEGIN,
    fetchFilterOptions_SUCCESS,
    fetchFilterOptions_FAILURE
} = filterOptionsSlice.actions

export default filterOptionsSlice;