import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHPaper from '../components/ECHPaper';
import { withLastLocation } from 'react-router-last-location';

class Login extends Component {
    render() {
        const pathToRedirect = this.props.lastLocation ? this.props.lastLocation.pathname : "/"
        return (
            <PageWrapper headlineTitle="Login" showBackButton={true}>
                <div style={{ alignContent: 'center' }}>
                    <ECHPaper type="login" title="Login" routeToRedirect={pathToRedirect} />
                </div>
            </PageWrapper>
        );
    }
}

export default withLastLocation(Login);