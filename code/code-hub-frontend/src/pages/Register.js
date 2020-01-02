import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHPaper from '../components/ECHPaper';

class Register extends Component {
    render() {
        return (
            <PageWrapper headlineTitle="Register">
                <div style={{ alignContent: 'center' }}>
                    <ECHPaper type="register" title="Register" />
                </div>
            </PageWrapper>
        );
    }
}

export default Register;