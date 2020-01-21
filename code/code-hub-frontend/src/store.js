import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import loggerMiddleware from './middleware/logger'

import createProjectSlice from './slices/createProjectSlice'
import projectOverviewSlice from './slices/projectOverviewSlice'
import currentProjectSlice from './slices/currentProjectSlice'

const store = configureStore({
    reducer: {
        createProject: createProjectSlice.reducer,
        projectOverview: projectOverviewSlice.reducer,
        currentProject: currentProjectSlice.reducer
    },
    // reducer: createProjectSliceReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()]
})

export default store;