import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper'
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    ErrorOutline as ErrorOutlineIcon,
} from '@material-ui/icons/';
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import ECHPaper from '../components/ECHPaper'
import { HOME, LOGIN } from '../routes'
import { connect } from 'react-redux'
import { activateUser } from '../actions/httpActions'
import { objectExists } from '../helper/objectHelper'
import { resetToDefaultState } from '../slices/activateSlice'
const qs = require('qs');

class Activate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            buttonTitle: "Back to home",
            buttonLink: HOME,
            paperTitle: 'Activation in process',
            noToken: false
        }
    }

    componentDidMount() {
        const parsedQuery = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
        const activationToken = parsedQuery.id
        if (activationToken) {
            this.props.activateUser(activationToken)
        } else {
            this.setState({ noToken: true })
        }
    }

    componentWillUnmount() {
        this.props.resetToDefaultState()
    }

    componentDidUpdate(prevProps) {
        const errorExists = objectExists(this.props.error)
        var alreadyUsedError = false
        if (errorExists) {
            alreadyUsedError = this.props.error.code === 401
        }

        if (prevProps.isLoading && !this.props.isLoading) {
            if (errorExists) {
                if (alreadyUsedError) {
                    this.setState({
                        buttonTitle: "Go to login",
                        buttonLink: LOGIN,
                        paperTitle: 'Already activated'
                    })
                } else {
                    this.setState({
                        buttonTitle: "Back to home",
                        buttonLink: HOME,
                        paperTitle: 'Activation failed'
                    })
                }
            } else {
                this.setState({
                    buttonTitle: "Go to login",
                    buttonLink: LOGIN,
                    paperTitle: 'Activation done'
                })
            }
        }
    }

    render() {
        const content = this.props.isLoading
            ? this._renderLoadingIndicator()
            : this._renderMessage()
        return (
            <PageWrapper headlineTitle="Verify mail and activate account" showBackButton={true}>
                <div>
                    <ECHPaper maxWidth="40vw" title={this.state.paperTitle} buttonTitle={this.state.buttonTitle} buttonLink={this.state.buttonLink}>
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
        if (this.props.activated) {
            return this._renderSuccessfulMessage()
        } else {
            if (this.state.noToken) {
                return this._renderNoToken()
            } else {
                return this._renderErrorMessage(this.props.error.code)
            }

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

    _renderNoToken() {
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

        var message = "Your link did not provide the activation token. Please use the link from the Email"

        return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ErrorOutlineIcon style={iconStyle} color={'primary'} />
            <div style={messageText}>This did not work out.<br />
                {message}
            </div>
        </div>
    }

    _renderErrorMessage(errorCode) {
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

        var message = ""
        if (errorCode === 404) {
            message = "The verification code you provided is not valid or was already used to activate the account."
        } else if (errorCode === 401) {
            message = "This verification code was already used and the account is activated. Your account is setup and you can login."
        }

        return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ErrorOutlineIcon style={iconStyle} color={'primary'} />
            <div style={messageText}>This did not work out.<br />
                {message}
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.activate.isLoading,
        activated: state.activate.activated,
        error: state.activate.error
    }
}

const mapDispatchToProps = { activateUser, resetToDefaultState }

export default connect(mapStateToProps, mapDispatchToProps)(Activate);