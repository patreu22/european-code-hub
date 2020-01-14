import { createSlice } from '@reduxjs/toolkit'


//So richtig exportiert...?
export default projectSlice => () => {
    return createSlice({
        name: "project",
        initialState: {
            counter: 0
        },
        reducers: {
            increment: state => { return { counter: state.counter + 1 } },
            decrement: state => { return { counter: state.counter - 1 } }
        }
    })
} 