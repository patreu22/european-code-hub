import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHPaper from '../components/ECHPaper';

class Login extends Component {
    render() {
        return (
            <PageWrapper headlineTitle="Login">
                <div style={{ alignContent: 'center' }}>
                    <ECHPaper type="login" title="Login" />
                </div>
            </PageWrapper>
        );
    }
}

export default Login;