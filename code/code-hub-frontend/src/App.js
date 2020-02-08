// import React, { Component } from 'react';
import React from 'react';
import './css/App.css';
import 'typeface-roboto';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { LastLocationProvider } from 'react-router-last-location';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { setVerificationCookieAndProfileImageAndUserNameInStore } from './actions/httpActions'
import { getVerificationToken } from './helper/cookieHelper'
import { HOME, ADD, CONTRIBUTE, SEARCH, LOGIN, REGISTER, USER, PROJECTS, PROFILE } from './routes'
import Home from './pages/Home';
import Search from './pages/Search';
import Add from './pages/Add';
import Catalogue from './pages/Catalogue'
import Project from './pages/Project'
import Login from './pages/Login'
import Register from './pages/Register'
import Contribute from './pages/Contribute'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

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

  componentDidMount() {
    const token = getVerificationToken()
    if (token) {
      this.props.setVerificationCookieAndProfileImageAndUserNameInStore(token)
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <LastLocationProvider>
            <Switch>
              <Route exact path={HOME} component={Home} />
              <Route path={ADD} component={Add} />
              <Route path={CONTRIBUTE} component={Contribute} />
              <Route path={`${SEARCH}/:searchterm?`} component={Search} />
              <Route path={LOGIN} component={Login} />
              <Route path={REGISTER} component={Register} />
              <Route path={`${USER}/:username?`} component={Profile} />
              <Route path={`${PROFILE}/:username?`} component={Profile} />
              <Route path={`${PROJECTS}/:projectname`} component={Project} />
              <Route path={PROJECTS} component={Catalogue} />
              <Route component={NotFound} />
            </Switch>
          </LastLocationProvider>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = { setVerificationCookieAndProfileImageAndUserNameInStore }

export default connect(mapStateToProps, mapDispatchToProps)(App);

// European color Blue: #004494
// Yellow: #ffd617