import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHPaper from '../components/ECHPaper';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showRegistration: true,
            showRegistrationDone: false
        };

        this._onRegistrationDoneHandler = this._onRegistrationDoneHandler.bind(this)
    }

    render() {
        const echPaperType = !this.state.showRegistration && this.state.showRegistrationDone
            ? "registrationDone"
            : "register"
        const echPaperTitle = !this.state.showRegistration && this.state.showRegistrationDone
            ? "Registration successful"
            : "Register"
        return (
            <PageWrapper headlineTitle="Register" showBackButton={true}>
                <div style={{ alignContent: 'center' }}>
                    <ECHPaper type={echPaperType} title={echPaperTitle} onRegistrationDone={this._onRegistrationDoneHandler} />
                </div>
            </PageWrapper>
        );
    }

    _onRegistrationDoneHandler() {
        this.setState({
            showRegistration: false,
            showRegistrationDone: true,
        })
    }
}

export default Register;