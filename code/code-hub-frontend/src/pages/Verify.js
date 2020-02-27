import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper'
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons/';
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import ECHPaper from '../components/ECHPaper'
import { HOME, LOGIN } from '../routes'
import { connect } from 'react-redux'
import { verifyUser } from '../actions/httpActions'
const qs = require('qs');

class Verify extends Component {

    constructor(props) {
        super(props)
        this.state = {
            buttonTitle: "Back to home",
            buttonLink: HOME
        }
    }

    componentDidMount() {
        const parsedQuery = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
        const activationToken = parsedQuery.id
        if (activationToken) {
            this.props.verifyUser(activationToken)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isLoading && !this.props.isLoading) {
            this.setState({
                buttonTitle: "Go to login",
                buttonLink: LOGIN
            })
        }
    }

    render() {
        const content = this.props.isLoading
            ? this._renderLoadingIndicator()
            : this._renderMessage()
        return (
            <PageWrapper headlineTitle="Verify Email" showBackButton={true}>
                <div>
                    <ECHPaper maxWidth="40vw" title="Verification" buttonTitle={this.state.buttonTitle} buttonLink={this.state.buttonLink}>
                        {content}
                    </ECHPaper>
                </div>
            </PageWrapper>
        );
    }

    _renderLoadingIndicator() {
        return <div style={{ display: 'flex', alignItems: 'center' }} >
            <ECHLoadingIndicator />
        </div>
    }

    _renderMessage() {
        if (this.props.verified) {
            return this._renderSuccessfulMessage()
        } else {
            return <div>TODO: SOMETHING WENT WRONG</div>
        }
    }

    _renderSuccessfulMessage() {
        const iconStyle = {
            paddingTop: '2vH',
            width: '60px',
            height: '60px',
            selfAlign: 'center'
        }

        const messageText = {
            textAlign: 'center',
            padding: '2vH 1vw 2vH 1vw'
        }

        return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CheckCircleOutlineIcon style={iconStyle} color={'primary'} />
            <div style={messageText}>You successfully verified your account.<br />
                You can now log in to your account and add new projects to the European Code Hub.<br />
                Thank you for your coming contributions!
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.verify.isLoading,
        verified: state.verify.verified
    }
}

const mapDispatchToProps = { verifyUser }

export default connect(mapStateToProps, mapDispatchToProps)(Verify);