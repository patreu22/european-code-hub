import { createSlice } from '@reduxjs/toolkit'


const projectSlice = createSlice({
    name: "project",
    initialState: {},
    reducers: {
        createProject: (state) => {
            return {
                ...state,
            }
        },
        updateProject: (state, action) => {
            const payload = action.payload;
            const newState = {
                ...state,
                update: payload.updateMessage
            }
            return newState;
        },
    }
})

// Redux boilerplate code
export const { createProject, updateProject } = projectSlice.actions

export default projectSlice;