import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHPaper from '../components/ECHPaper';
import { withLastLocation } from 'react-router-last-location';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { USER } from '../routes'

class Login extends Component {

    render() {
        const pathToRedirect = this.props.lastLocation ? this.props.lastLocation.pathname : "/"
        if (this.props.cookie && pathToRedirect) {
            return <Redirect to={pathToRedirect} />
        } else {
            const contentToRender = this.props.cookie
                ? <Redirect to={USER} />
                : this.pageContent()
            return contentToRender
        }
    }

    pageContent = () => {
        const pathToRedirect = this.props.lastLocation ? this.props.lastLocation.pathname : "/"
        return < PageWrapper headlineTitle="Login" showBackButton={true} >
            <div style={{ alignContent: 'center' }}>
                <ECHPaper type="login" title="Login" routeToRedirect={pathToRedirect} />
            </div>
        </PageWrapper >
    }
}


const mapStateToProps = state => {
    return {
        cookie: state.user.cookie
    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withLastLocation(Login));