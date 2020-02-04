import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "user",
    initialState: {
        cookie: '',
        profilePicture: '',
    },
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
            //TODO: Correct stuff with Error
            const payload = action.payload
            return {
                ...state,

            }
        },
        resetVerificationCookie: (state) => {
            return {
                ...state,
                cookie: ''
            }
        },
        resetUserData: (state) => {
            return {
                ...state,
                cookie: '',
                profilePicture: ''
            }
        }

    }
})

export const {
    setVerificationCookie,
    fetchProfilePicture_SUCCESS,
    resetUserData
} = userSlice.actions

export default userSlice;