import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import loggerMiddleware from './middleware/logger'

import createProjectSlice from './slices/createProjectSlice'
import projectOverviewSlice from './slices/projectOverviewSlice'
import currentProjectSlice from './slices/currentProjectSlice'
import searchSlice from './slices/searchSlice'
import userSlice from './slices/userSlice'
import activateSlice from './slices/activateSlice'
import filterOptionsSlice from './slices/filterOptionsSlice'

const store = configureStore({
    reducer: {
        createProject: createProjectSlice.reducer,
        projectOverview: projectOverviewSlice.reducer,
        currentProject: currentProjectSlice.reducer,
        search: searchSlice.reducer,
        user: userSlice.reducer,
        activate: activateSlice.reducer,
        filterOptions: filterOptionsSlice.reducer
    },
    middleware: [loggerMiddleware, ...getDefaultMiddleware()]
})

export default store;