import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import loggerMiddleware from './middleware/logger'

import createProjectSlice from './slices/createProjectSlice'
import projectOverviewSlice from './slices/projectOverviewSlice'

const store = configureStore({
    reducer: {
        createProject: createProjectSlice.reducer,
        projectOverview: projectOverviewSlice.reducer
    },
    // reducer: createProjectSliceReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()]
})

export default store;