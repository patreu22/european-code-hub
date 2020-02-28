import React, { Component } from 'react';
import { Divider, FormHelperText, Paper } from '@material-ui/core'
import { MailOutline as MailOutlineIcon } from '@material-ui/icons';
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { incrementSteps } from '../slices/createProjectSlice'
import { isValidEmail, isValidPassword, isValidUrl, isValidText } from '../helper/validationHelper'
import ImageUploader from 'react-images-upload';
import { objectExists } from '../helper/objectHelper'
import ECHButton from './ECHButton'
import ECHTextfield from './ECHTextfield'
import { LOGIN, HOME } from '../routes'
import { setVerificationCookieAndProfileImageAndUserNameInStore, registerUser, requestLoginToken } from '../actions/httpActions'
import ECHLoadingIndicator from './ECHLoadingIndicator';

class ECHPaper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            password: '',
            username: '',
            name: '',
            organization: '',
            profileImage: null,
            secondsLeft: 10,
            mailError: false,
            mailErrorMessage: "",
            passwordError: false,
            passwordErrorMessage: "",
            nameError: false,
            nameErrorMessage: "",
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
            loginHeight: 0
        };
        this.timer = 0;
        this._performLogin = this._performLogin.bind(this)
        this._performGitFetch = this._performGitFetch.bind(this)
        this._performRegistration = this._performRegistration.bind(this)
        this.onImageDrop = this.onImageDrop.bind(this);
        // this._countDown = this._countDown.bind(this);
    }

    componentWillUnmount() {
        // clearInterval(this.timer);
    }

    componentDidMount() {
        if (this.props.type === "login") {
            const height = document.getElementById("loginContainer").clientHeight;
            this.setState({ loginHeight: height })
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.cookie && this.props.cookie) {
            this.setState({
                redirect: true,
            })
        }

        if (!objectExists(prevProps.error) && objectExists(this.props.error)) {
            const code = this.props.error.code
            if (code === 400) {
                this.setState({
                    formError: true,
                    formErrorText: 'Credentials do not match.',
                    loginLoading: false
                })
            } else if (code === 401) {
                this.setState({
                    formError: true,
                    formErrorText: 'Please activate your account via the link in the verification mail first.',
                    loginLoading: false
                })
            } else {
                console.log("Unknown error.")
            }
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
            if (this.props.isLoading) {
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
        } else if (this.props.type === "register" && !this.props.isLoading) {
            return <div>
                {this.props.title ? <Divider /> : null}
                <form style={formParagraphStyle}>
                    {this._renderUserNameField()}
                    {this._renderEmailField()}
                    {this._renderNameField()}
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
        } else if (this.props.type === "register" && this.props.isLoading) {
            return <div style={{ paddingBottom: '30px', display: 'flex', justifyContent: 'center' }}><ECHLoadingIndicator /></div>
        } else if (this.props.type === "registrationDone") {
            return <div>{this.props.title ? <Divider /> : null}
                <MailOutlineIcon style={iconStyle} color={'primary'} />
                <div style={registrationDoneText}>You successfully created a new account.<br />
                    Please check your mail account and verify your email account. After this you can login to your account and add new projects to the European Code Hub.<br /><br />
                    Click <Link to={HOME} style={{ color: 'black' }}>here</Link> to go back to the home page.</div>
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
            required={true}
            onChange={(event) => this.onUsernameChanged(event)}
            onBlur={(event) => this.onUsernameFieldBlurred(event)}
            error={this.state.usernameError}
            value={this.state.username}
            helperText={this.state.usernameErrorMessage}
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
        />
    }

    _renderNameField() {
        return <ECHTextfield
            label="Full name"
            required={true}
            onChange={(event) => this.onNameChanged(event)}
            onBlur={(event) => this.onNameChanged(event)}
            error={this.state.nameError}
            helperText={this.state.nameErrorMessage}
            value={this.state.name}
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
        />
    }

    _renderOrganizationField() {
        return <ECHTextfield
            label="Organization"
            required={true}
            onChange={(event) => this.onOrganizationChanged(event)}
            onBlur={(event) => this.onOrganizationFieldBlurred(event)}
            error={this.state.organizationError}
            value={this.state.organization}
            helperText={this.state.organizationErrorMessage}
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
        />
    }

    _renderEmailField() {
        return <ECHTextfield
            label="Email"
            required={true}
            onChange={(event) => this.onMailChanged(event)}
            onBlur={(event) => this.onMailFieldBlurred(event)}
            error={this.state.mailError}
            helperText={this.state.mailErrorMessage}
            value={this.state.mail}
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
        />
    }

    _renderUrlField() {
        return <ECHTextfield
            label="URL"
            required={true}
            onChange={(event) => this.onUrlChanged(event)}
            onBlur={(event) => this.onUrlFieldBlurred(event)}
            error={this.state.gitUrlError}
            value={this.state.gitUrl}
            helperText={this.state.gitUrlErrorMessage}
        />
    }

    _renderPasswordField() {
        return <ECHTextfield
            label="Password"
            type="password"
            required={true}
            error={this.state.passwordError}
            helperText={this.state.passwordErrorMessage}
            autoComplete="current-password"
            value={this.state.password}
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

    onNameChanged(event) {
        this.setState({
            name: event.target.value,
            nameError: false,
            nameErrorMessage: "",
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

    onNameFieldBlurred(event) {
        const isValid = isValidText(event.target.value)
        this.setState({
            nameError: !isValid,
            nameErrorMessage: isValid ? "" : "Invalid name."
        })
    }

    onOrganizationFieldBlurred(event) {
        const isValid = isValidText(event.target.value)
        this.setState({
            organizationError: !isValid,
            organizationErrorMessage: isValid ? "" : "Invalid organization."
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
            this.props.requestLoginToken(this.state.mail, this.state.password)
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
        const validName = isValidText(this.state.name)
        const validPassword = isValidPassword(this.state.password)
        const validUsername = isValidText(this.state.username)
        const validOrganization = isValidText(this.state.organization)
        if (validMail && validPassword && validUsername && validOrganization && validName) {
            this.props.registerUser(this.state.username, this.state.password, this.state.mail, this.state.name, this.state.organization, this.state.profileImage)
                .then(() => {
                    this.props.onRegistrationDone();
                    // this._startCountdown();
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
            if (!validName) {
                this.setState({
                    nameError: true,
                    nameErrorMessage: 'Not a valid name.'
                })
            }
        }
    }

    // _startCountdown() {
    //     if (this.timer === 0 && this.state.secondsLeft > 0) {
    //         this.timer = setInterval(this._countDown, 1000);
    //     }
    // }

    // _countDown() {
    //     let seconds = this.state.secondsLeft - 1;
    //     this.setState({
    //         secondsLeft: seconds,
    //     });

    //     if (seconds === 0) {
    //         clearInterval(this.timer);
    //     }
    // }

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
        isLoading: state.user.isLoading,
        cookie: state.user.cookie,
        error: state.user.error
    }
}

const mapDispatchToProps = { incrementSteps, setVerificationCookieAndProfileImageAndUserNameInStore, registerUser, requestLoginToken }

export default connect(mapStateToProps, mapDispatchToProps)(ECHPaper);