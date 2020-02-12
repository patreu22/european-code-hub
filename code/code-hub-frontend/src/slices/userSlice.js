import { createSlice } from '@reduxjs/toolkit'

const resetUserDataDefault = {
    isLoading: false,
    currentUserData: {},
    ownUserData: {}
}

const defaultState = {
    cookie: '',
    profilePicture: '',
    username: '',
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
        fetchProfilePictureAndUsername_SUCCESS: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                profilePicture: payload.profilePicture,
                username: payload.username
            }
        },
        fetchProfilePictureAndUsername_FAILURE: (state, action) => {
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
        resetToDefault: () => {
            return defaultState
        },
        updateUserData_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        updateUserData_SUCCESS: (state) => {
            return {
                ...state,
                isLoading: false
            }
        },
        updateUserData_FAILURE: (state) => {
            return {
                ...state,
                isLoading: false
            }
        }
    }
})

export const {
    setVerificationCookie,
    fetchProfilePictureAndUsername_SUCCESS,
    fetchProfilePictureAndUsername_FAILURE,
    resetUserData,
    resetToDefault,
    fetchUserData_BEGIN,
    fetchUserData_SUCCESS,
    fetchUserData_FAILURE,
    fetchOwnUserData_BEGIN,
    fetchOwnUserData_SUCCESS,
    fetchOwnUserData_FAILURE,
    updateUserData_BEGIN,
    updateUserData_SUCCESS,
    updateUserData_FAILURE
} = userSlice.actions

export default userSlice;