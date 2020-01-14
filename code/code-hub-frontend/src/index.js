import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import * as serviceWorker from './helper/serviceWorker';
import { configureStore } from '@reduxjs/toolkit'
import { projectSlice } from './reducers/ProjectReducers'

const store = configureStore({
    reducer: projectSlice.reducer
})


ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();