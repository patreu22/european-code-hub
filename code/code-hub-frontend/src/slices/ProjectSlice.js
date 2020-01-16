import { createSlice } from '@reduxjs/toolkit'


const projectSlice = createSlice({
    name: "project",
    initialState: 0,
    reducers: {
        increment: state => state + 1,
        decrement: state => state - 1,
    }
})

// Redux boilerplate code
// export const { increment, decrement } = projectSlice.actions

export default projectSlice;