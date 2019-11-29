// import React, { Component } from 'react';
import React from 'react';
import './css/App.css';
import 'typeface-roboto';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import { ThemeProvider } from '@material-ui/styles';


class App extends React.Component {

  render() {
    return (
      <ThemeProvider>
        <Router>
          <Switch>
            <Route path="/"><Home /></Route>
            {/* <Route path="/profile"><UserProfile /></Route>
          <Route path="/browse"><ProjectBrowser /></Route> */}
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;

// European color Blue: #004494
// Yellow: #ffd617