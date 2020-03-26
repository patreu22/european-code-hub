import { createSlice } from '@reduxjs/toolkit'

const resetUserDataDefault = {
    isLoading: false,
    currentUserData: {},
    userProjects: [],
    ownUserData: {}
}

const defaultState = {
    cookie: '',
    profilePicture: '',
    username: '',
    error: {},
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
        fetchProfilePictureAndUsername_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        fetchProfilePictureAndUsername_SUCCESS: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                profilePicture: payload.profilePicture,
                username: payload.username,
                isLoading: false
            }
        },
        fetchProfilePictureAndUsername_FAILURE: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                isLoading: false,
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
        fetchUserToken_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        fetchUserToken_SUCCESS: (state) => {
            return {
                ...state,
                isLoading: false
            }
        },
        fetchUserToken_FAILURE: (state, action) => {
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
        fetchUserProjects_BEGIN: (state) => {
            return {
                ...state,
                isLoadingProjects: true
            }
        },
        fetchUserProjects__SUCCESS: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                isLoadingProjects: false,
                userProjects: payload.userProjects
            }
        },
        fetchUserProjects_FAILURE: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                isLoadingProjects: false,
                userProjects: [],
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
        },
        registerUser_BEGIN: (state) => {
            return {
                ...state,
                isLoading: true
            }
        },
        registerUser_SUCCESS: (state) => {
            return {
                ...state,
                isLoading: false
            }
        },
        registerUser_FAILURE: (state) => {
            return {
                ...state,
                isLoading: false
            }
        },
        resetError: (state) => {
            return {
                ...state,
                error: {}
            }
        }
    }
})

export const {
    setVerificationCookie,
    fetchProfilePictureAndUsername_BEGIN,
    fetchProfilePictureAndUsername_SUCCESS,
    fetchProfilePictureAndUsername_FAILURE,
    resetUserData,
    resetToDefault,
    resetVerificationCookie,
    fetchUserData_BEGIN,
    fetchUserData_SUCCESS,
    fetchUserData_FAILURE,
    fetchOwnUserData_BEGIN,
    fetchOwnUserData_SUCCESS,
    fetchOwnUserData_FAILURE,
    fetchUserProjects_BEGIN,
    fetchUserProjects__SUCCESS,
    fetchUserProjects_FAILURE,
    updateUserData_BEGIN,
    updateUserData_SUCCESS,
    updateUserData_FAILURE,
    registerUser_BEGIN,
    registerUser_SUCCESS,
    registerUser_FAILURE,
    fetchUserToken_BEGIN,
    fetchUserToken_SUCCESS,
    fetchUserToken_FAILURE,
    resetError
} = userSlice.actions

export default userSlice;