import { configureStore } from '@reduxjs/toolkit'
import projectSlice from './slices/ProjectSlice'

const store = configureStore({
    reducer: projectSlice.reducer
})

export default store;