// import React, { Component } from 'react';
import React from 'react';
import './css/App.css';
import 'typeface-roboto';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { LastLocationProvider } from 'react-router-last-location';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './pages/Home';
import Search from './pages/Search';
import Add from './pages/Add';
import Catalogue from './pages/Catalogue'
import Project from './pages/Project'
import Login from './pages/Login'
import Register from './pages/Register'
import Contribute from './pages/Contribute'
import Profile from './pages/Profile'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004494'
    },
    secondary: {
      main: '#ffd617'
    }
  }
})
class App extends React.Component {

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <LastLocationProvider>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/add" component={Add} />
              <Route path="/contribute" component={Contribute} />
              <Route path="/search/:searchterm?" component={Search} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/user/:username?" component={Profile} />
              <Route path="/projects/:projectname" component={Project} />
              <Route path="/projects" component={Catalogue} />
            </Switch>
          </LastLocationProvider>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;

// European color Blue: #004494
// Yellow: #ffd617