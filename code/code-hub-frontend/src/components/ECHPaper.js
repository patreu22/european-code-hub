import React, { Component } from 'react';
import { Divider, FormHelperText, Paper } from '@material-ui/core'
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { incrementSteps } from '../slices/createProjectSlice'
import { registerUser } from '../helper/httpHelper'
import { isValidEmail, isValidPassword, isValidUrl } from '../helper/validationHelper'
import { requestLoginToken } from '../helper/httpHelper'
import { setVerificationToken } from '../helper/cookieHelper'
import ImageUploader from 'react-images-upload';
import { objectExists } from '../helper/objectHelper'
import ECHButton from './ECHButton'
import ECHTextfield from './ECHTextfield'

class ECHPaper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            password: '',
            profileImage: null,
            secondsLeft: 10,
            mailError: false,
            mailErrorMessage: "",
            passwordError: false,
            passwordErrorMessage: "",
            formError: false,
            formErrorText: "",
            redirect: false,
            gitUrl: "",
            gitUrlError: false,
            gitUrlErrorMessage: "",
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
            alignSelf: 'baseline'
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
            return <div>
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
                    {this._renderEmailField()}
                    {this._renderPasswordField()}
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
                <div style={registerTextStyle}>You already have an account?  <Link to="/login" style={{ color: 'black' }}>Login</Link> directly.</div>
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
        //TODO: Loading indicator
        const validMail = isValidEmail(this.state.mail)
        const validPassword = isValidPassword(this.state.password)
        if (validMail && validPassword) {
            requestLoginToken(this.state.mail, this.state.password)
                .then((token) => {
                    setVerificationToken(token);
                    this.setState({
                        redirect: true
                    })
                }).catch((error) => {
                    console.log(error)
                    if (error.response.status === 400) {
                        this.setState({
                            formError: true,
                            formErrorText: 'Credentials do not match.'
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


    _performGitFetch() {
        console.log("Hello?")
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
        if (validMail && validPassword) {
            registerUser(`user-${this.state.mail}`, this.state.password, this.state.mail, "novice", this.state.profileImage)
                .then((response) => {
                    this.props.onRegistrationDone();
                    this._startCountdown();
                })
                .catch((error) => {
                    if (error.response.status === 400) {
                        this.setState({
                            mailError: true,
                            mailErrorMessage: 'Mail already registered.'
                        })
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
        step: state.createProject.step
    }
}

const mapDispatchToProps = { incrementSteps }

export default connect(mapStateToProps, mapDispatchToProps)(ECHPaper);