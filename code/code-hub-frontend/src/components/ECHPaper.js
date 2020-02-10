import React, { Component } from 'react';
import { Divider, FormHelperText, Paper } from '@material-ui/core'
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { incrementSteps } from '../slices/createProjectSlice'
import { registerUser } from '../helper/httpHelper'
import { isValidEmail, isValidPassword, isValidUrl, isValidText } from '../helper/validationHelper'
import { requestLoginToken } from '../helper/httpHelper'
import { setVerificationToken } from '../helper/cookieHelper'
import ImageUploader from 'react-images-upload';
import { objectExists } from '../helper/objectHelper'
import ECHButton from './ECHButton'
import ECHTextfield from './ECHTextfield'
import { LOGIN } from '../routes'
import { setVerificationCookieAndProfileImageAndUserNameInStore } from '../actions/httpActions'
import ECHLoadingIndicator from './ECHLoadingIndicator';

class ECHPaper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            password: '',
            username: '',
            organization: '',
            profileImage: null,
            secondsLeft: 10,
            mailError: false,
            mailErrorMessage: "",
            passwordError: false,
            passwordErrorMessage: "",
            usernameError: false,
            usernameErrorMessage: "",
            organizationError: false,
            organizationErrorMessage: "",
            formError: false,
            formErrorText: "",
            redirect: false,
            gitUrl: "",
            gitUrlError: false,
            gitUrlErrorMessage: "",
            loginLoading: false,
            loginHeight: 0
        };
        this.timer = 0;
        this._performLogin = this._performLogin.bind(this)
        this._performGitFetch = this._performGitFetch.bind(this)
        this._performRegistration = this._performRegistration.bind(this)
        this.onImageDrop = this.onImageDrop.bind(this);
        this._countDown = this._countDown.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        if (this.props.type === "login") {
            const height = document.getElementById("loginContainer").clientHeight;
            this.setState({ loginHeight: height })
        }
    }

    render() {
        const catalogueBoxStyle = {
            alignContent: 'center',
            textAlign: 'center',
            color: 'black',
            marginTop: '4vh',
            marginLeft: '0.5vw',
            marginRight: '0.5vw',
            marginBottom: '4vH',
            paddingTop: '1vh',
            backgroundColor: 'F5F5F5',
            minWidth: this.props.minWidth ?? this.props.width ?? '29vw',
            maxWidth: this.props.maxWidth ?? this.props.width ?? '100vw',
            alignSelf: 'stretch',
        }

        if (this.state.secondsLeft > 0 && !this.state.redirect) {
            return (
                <Paper style={catalogueBoxStyle} border={1}>
                    {this.props.title ? <h3>{this.props.title}</h3> : null}
                    {this._renderContentField()}
                </Paper>
            );
        } else {
            const path = this.props.routeToRedirect ? this.props.routeToRedirect : '/'
            return <Redirect to={path} />
        }
    }

    _renderContentField() {
        const textWhenButtonVisible = {
            textAlign: 'left',
            padding: '1vH 1vw 1vH 1vw'
        }
        const textWhenButtonInvisible = {
            textAlign: 'left',
            padding: '2vH 1vw 2vH 1vw'
        }

        const registrationDoneText = {
            textAlign: 'center',
            padding: '2vH 1vw 2vH 1vw'
        }

        const formParagraphStyle = {
            textAlign: 'center',
            padding: '2vH 1vw 2vH 1vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }

        const dropzoneWrapperStyle = {
            maxWidth: '80%',
            paddingBottom: '1vw',
        }

        const iconStyle = {
            paddingTop: '2vH',
            width: '60px',
            height: '60px',
        }

        const paragraphStyle = this.props.buttonTitle ? textWhenButtonVisible : textWhenButtonInvisible
        if (this.props.type === "login") {
            if (this.state.loginLoading) {
                return <div style={{ height: this.state.loginHeight, display: 'flex', justifyContent: 'center' }}><ECHLoadingIndicator /></div>
            }
            return <div id="loginContainer">
                {this.props.title ? <Divider /> : null}
                <form style={formParagraphStyle}>
                    {this._renderEmailField()}
                    {this._renderPasswordField()}
                    {this._renderFormHelperText()}
                    {this._renderSubmitButton()}
                </form>
            </div>
        } else if (this.props.type === "register") {
            return <div>
                {this.props.title ? <Divider /> : null}
                <form style={formParagraphStyle}>
                    {this._renderUserNameField()}
                    {this._renderEmailField()}
                    {this._renderPasswordField()}
                    {this._renderOrganizationField()}
                    <div style={dropzoneWrapperStyle}>
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose a profile picture'
                            withPreview
                            label="optional"
                            onChange={this.onImageDrop}
                            accept="accept=image/*"
                            singleImage={true}
                            maxFileSize={5242880}
                            disable={this.state.profileImage}
                            buttonStyles={{ display: this.state.profileImage ? 'none' : 'block' }}
                        />
                    </div>
                    {this._renderSubmitButton()}
                </form>
            </div>
        } else if (this.props.type === "registrationDone") {
            return <div>{this.props.title ? <Divider /> : null}
                <CheckCircleOutlineIcon style={iconStyle} color={'primary'} />
                <div style={registrationDoneText}>You successfully created a new account.<br />
                    Click <Link to="/" style={{ color: 'black' }}>here</Link> to be redirected instantly.<br /><br />
                    Otherwise you will be sent back to the main page in {this.state.secondsLeft} second{this.state.secondsLeft === 1 ? "" : "s"} automatically.</div>
            </div >
        } else if (this.props.type === "addProjectViaGit") {
            return <div>
                {this.props.title ? <Divider /> : null}
                <form style={formParagraphStyle}>
                    {this._renderUrlField()}
                    {this._renderSubmitButton()}
                </form>
            </div>
        } else {
            const children = objectExists(this.props.children)
                ? this.props.children.type
                    ? this.props.children
                    : <p style={paragraphStyle}>{this.props.children}</p>
                : null
            return <div>
                {this.props.title ? <Divider /> : null}
                <div style={paragraphStyle}>{children}</div>
                {this.props.buttonTitle ? <ECHButton buttonLink={this.props.buttonLink} onClick={this.props.onButtonClickHandler} href={this.props.href}>{this.props.buttonTitle}</ECHButton> : null}
            </div>
        }
    }

    onImageDrop(pictureFiles) {
        this.setState({
            profileImage: pictureFiles[0],
        });
    }

    _renderFormHelperText() {
        return <FormHelperText error={this.state.formError}>{this.state.formErrorText}</FormHelperText>
    }

    _renderUserNameField() {
        return <ECHTextfield
            label="Username"
            onChange={(event) => this.onUsernameChanged(event)}
            onBlur={(event) => this.onUsernameFieldBlurred(event)}
            error={this.state.usernameError}
            helperText={this.state.usernameErrorMessage}
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
        />
    }

    _renderOrganizationField() {
        return <ECHTextfield
            label="Organization"
            onChange={(event) => this.onOrganizationChanged(event)}
            onBlur={(event) => this.onOrganizationFieldBlurred(event)}
            error={this.state.organizationError}
            helperText={this.state.organizationErrorMessage}
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
        />
    }

    _renderEmailField() {
        return <ECHTextfield
            label="Email"
            onChange={(event) => this.onMailChanged(event)}
            onBlur={(event) => this.onMailFieldBlurred(event)}
            error={this.state.mailError}
            helperText={this.state.mailErrorMessage}
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
        />
    }

    _renderUrlField() {
        return <ECHTextfield
            label="URL"
            onChange={(event) => this.onUrlChanged(event)}
            onBlur={(event) => this.onUrlFieldBlurred(event)}
            error={this.state.gitUrlError}
            helperText={this.state.gitUrlErrorMessage}
        />
    }

    _renderPasswordField() {
        return <ECHTextfield
            label="Password"
            type="password"
            error={this.state.passwordError}
            helperText={this.state.passwordErrorMessage}
            autoComplete="current-password"
            onChange={(event) => this.onPasswordChanged(event)}
            onBlur={(event) => this.onPasswordFieldBlurred(event)}
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
        />
    }

    _renderSubmitButton() {
        const registerTextStyle = {
            marginBottom: '2vh',
            paddingTop: '1vh',
            color: 'black'
        }

        if (this.props.type === 'login') {
            return <div style={{ width: '100%' }}>
                <ECHButton width="80%" onClick={this._performLogin}>Login</ECHButton>
                <div style={registerTextStyle}>or do you need to  <Link to="/register" style={{ color: 'black' }}>register</Link> first?</div>
            </div>
        } else if (this.props.type === 'register') {
            return <div style={{ width: '100%' }}>
                <ECHButton width="80%" onClick={this._performRegistration}>Register</ECHButton>
                <div style={registerTextStyle}>You already have an account?  <Link to={LOGIN} style={{ color: 'black' }}>Login</Link> directly.</div>
            </div>
        } else if (this.props.type === 'addProjectViaGit') {
            return <div style={{ width: '100%' }}>
                <ECHButton width="80%" onClick={this._performGitFetch}>Next step</ECHButton>
            </div>
        }
    }

    //value, error, errorMessage, formError, formErrorText
    onMailChanged(event) {
        this.setState({
            mail: event.target.value,
            mailError: false,
            mailErrorMessage: "",
            formError: false,
            formErrorText: ''
        })
    }

    onUsernameChanged(event) {
        this.setState({
            username: event.target.value,
            usernameError: false,
            usernameErrorMessage: "",
            formError: false,
            formErrorText: ''
        })
    }

    onOrganizationChanged(event) {
        this.setState({
            organization: event.target.value,
            organizationError: false,
            organizationErrorMessage: "",
            formError: false,
            formErrorText: ''
        })
    }

    onUrlChanged(event) {
        this.setState({
            gitUrl: event.target.value,
            gitUrlError: false,
            gitUrlErrorMessage: "",
            formError: false,
            formErrorText: ''
        })
    }

    onMailFieldBlurred(event) {
        const isValid = isValidEmail(event.target.value)
        console.log(`Is ${event.target.value} valid mail? - ${isValid}`);
        this.setState({
            mailError: !isValid,
            mailErrorMessage: isValid ? "" : "Invalid Email address"
        })
    }

    onUsernameFieldBlurred(event) {
        const isValid = isValidText(event.target.value)
        this.setState({
            usernameError: !isValid,
            usernameErrorMessage: isValid ? "" : "Invalid username."
        })
    }

    onOrganizationFieldBlurred(event) {
        const isValid = isValidText(event.target.value)
        this.setState({
            organizationError: !isValid,
            organizationErrorMessage: isValid ? "" : "Invalid username."
        })
    }

    onUrlFieldBlurred(event) {
        const isValid = isValidUrl(event.target.value)
        console.log(`Is ${event.target.value} valid Url? - ${isValid}`);
        this.setState({
            gitUrlError: !isValid,
            gitUrlErrorMessage: isValid ? "" : "Invalid URL"
        })
    }

    onPasswordChanged(event) {
        this.setState({
            password: event.target.value,
            passwordError: false,
            passwordErrorMessage: "",
            formError: false,
            formErrorText: ''
        })
    }

    onPasswordFieldBlurred(event) {
        const isValid = isValidPassword(event.target.value)
        this.setState({
            passwordError: !isValid,
            passwordErrorMessage: isValid ? "" : "Invalid Password"
        })
    }

    _performLogin() {
        const validMail = isValidEmail(this.state.mail)
        const validPassword = isValidPassword(this.state.password)
        if (validMail && validPassword) {
            this.setState({ loginLoading: true })
            requestLoginToken(this.state.mail, this.state.password)
                .then((token) => {
                    setVerificationToken(token);
                    this.setState({
                        redirect: true,
                        loginLoading: false
                    })
                    this.props.setVerificationCookieAndProfileImageAndUserNameInStore(token)
                }).catch((error) => {
                    console.log(error)
                    if (error.response.status === 400) {
                        this.setState({
                            formError: true,
                            formErrorText: 'Credentials do not match.',
                            loginLoading: false
                        })
                    } else {
                        console.log("Unknown error.")
                    }
                })
        } else {
            if (!validMail) {
                this.setState({
                    mailError: true,
                    mailErrorMessage: 'Not a valid mail.',
                })
            }
            if (!validPassword) {
                this.setState({
                    passwordError: true,
                    passwordErrorMessage: 'Not a valid password.'
                })
            }
        }
    }


    //TODO: Git fetch
    _performGitFetch() {
        const validUrl = isValidUrl(this.state.gitUrl)
        if (!validUrl) {
            this.setState({
                gitUrlError: true,
                gitUrlErrorMessage: 'Not a valid URL.',
            })
        } else {
            console.log("Todo: Git fetch")
        }
    }

    _performRegistration() {
        //TODO: Data validation, Email check and long password check
        const validMail = isValidEmail(this.state.mail)
        const validPassword = isValidPassword(this.state.password)
        const validUsername = isValidText(this.state.username)
        const validOrganization = isValidText(this.state.organization)
        if (validMail && validPassword && validUsername && validOrganization) {
            registerUser(this.state.username, this.state.password, this.state.mail, this.state.organization, this.state.profileImage)
                .then((response) => {
                    this.props.onRegistrationDone();
                    this._startCountdown();
                })
                .catch((error) => {
                    if (error.response.status === 400) {
                        if (error.response.data.errorType === "mailExists") {
                            this.setState({
                                mailError: true,
                                mailErrorMessage: 'Mail already registered.'
                            })
                        } else if (error.response.data.errorType === "usernameExists") {
                            this.setState({
                                usernameError: true,
                                usernameErrorMessage: 'Username already exists.'
                            })
                        } else {
                            this.setState({
                                formError: true,
                                formErrorText: "Un unexpected error ocurred."
                            })
                        }
                    } else {
                        console.log("Unknown error.")
                    }
                });
        } else {
            if (!validMail) {
                this.setState({
                    mailError: true,
                    mailErrorMessage: 'Not a valid mail.'
                })
            }
            if (!validPassword) {
                this.setState({
                    passwordError: true,
                    passwordErrorMessage: 'Not a valid password.'
                })
            }
            if (!validUsername) {
                this.setState({
                    usernameError: true,
                    usernameErrorMessage: 'Not a valid username.'
                })
            }
            if (!validOrganization) {
                this.setState({
                    organizationError: true,
                    organizationErrorMessage: 'Not a valid organization name.'
                })
            }
        }
    }

    _startCountdown() {
        if (this.timer === 0 && this.state.secondsLeft > 0) {
            this.timer = setInterval(this._countDown, 1000);
        }
    }

    _countDown() {
        let seconds = this.state.secondsLeft - 1;
        this.setState({
            secondsLeft: seconds,
        });

        if (seconds === 0) {
            clearInterval(this.timer);
        }
    }

    _handleKeyDown(event) {
        if (event.key === 'Enter') {
            if (this.props.type === "login") {
                this._performLogin()
            } else if (this.props.type === "register") {
                this._performRegistration();
            }
        }
    }
}

ECHPaper.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    routeToRedirect: PropTypes.string,
    buttonTitle: PropTypes.string,
    onButtonClickHandler: PropTypes.func,
    onRegistrationDone: PropTypes.func,
    onLoginDone: PropTypes.func,
};

ECHPaper.defaultProps = {
    onRegistrationDone: () => { },
    onLoginDone: () => { },
}

const mapStateToProps = state => {
    return {
        projectData: state.createProject.projectData,
        step: state.createProject.step,
    }
}

const mapDispatchToProps = { incrementSteps, setVerificationCookieAndProfileImageAndUserNameInStore }

export default connect(mapStateToProps, mapDispatchToProps)(ECHPaper);