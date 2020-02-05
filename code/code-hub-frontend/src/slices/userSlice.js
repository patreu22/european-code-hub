import { createSlice } from '@reduxjs/toolkit'

const resetUserDataDefault = {
    isLoading: false,
    currentUserData: {},
    ownUserData: {}
}

const defaultState = {
    cookie: '',
    profilePicture: '',
    ...resetUserDataDefault
}

const userSlice = createSlice({
    name: "user",
    initialState: defaultState,
    reducers: {
        setVerificationCookie: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                cookie: payload.cookie
            }
        },
        fetchProfilePicture_SUCCESS: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                profilePicture: payload.profilePicture
            }
        },
        fetchProfilePicture_FAILURE: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                error: {
                    code: payload.errorCode,
                    message: payload.errorMessage
                }
            }
        },
        resetVerificationCookie: (state) => {
            return {
                ...state,
                cookie: ''
            }
        },
        fetchUserData_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        fetchUserData_SUCCESS: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                isLoading: false,
                currentUserData: payload.userData
            }

        },
        fetchUserData_FAILURE: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                isLoading: false,
                currentUserData: {},
                error: {
                    code: payload.errorCode,
                    message: payload.errorMessage
                }
            }
        },
        fetchOwnUserData_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        fetchOwnUserData_SUCCESS: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                isLoading: false,
                ownUserData: payload.userData
            }

        },
        fetchOwnUserData_FAILURE: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                isLoading: false,
                ownUserData: {},
                error: {
                    code: payload.errorCode,
                    message: payload.errorMessage
                }
            }
        },
        resetUserData: (state) => {
            return {
                ...state,
                ...resetUserDataDefault
            }
        },
        resetToDefault: (state) => {
            return defaultState
        }
    }
})

export const {
    setVerificationCookie,
    fetchProfilePicture_SUCCESS,
    fetchProfilePicture_FAILURE,
    resetUserData,
    resetToDefault,
    fetchUserData_BEGIN,
    fetchUserData_SUCCESS,
    fetchUserData_FAILURE,
    fetchOwnUserData_BEGIN,
    fetchOwnUserData_SUCCESS,
    fetchOwnUserData_FAILURE,
} = userSlice.actions

export default userSlice;