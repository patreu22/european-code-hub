import React, { Component, } from 'react';
import { Button, Divider, Paper, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { registerUser } from '../helper/httpHelper'
import { isValidEmail, isValidPassword } from '../helper/validationHelper'
import { requestLoginToken } from '../helper/httpHelper'
import { setVerificationToken, getVerificationToken } from '../helper/cookieHelper'

class ECHPaper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            password: ''
        };

        this._performLogin = this._performLogin.bind(this)
        this._performRegistration = this._performRegistration.bind(this)
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
            width: '29vw',
            alignSelf: 'baseline'
        }

        return (
            <Paper style={catalogueBoxStyle} border={1}>
                {this.props.title ? <h3>{this.props.title}</h3> : null}
                {this._renderContentField()}
            </Paper>
        );
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

        const formParagraphStyle = {
            textAlign: 'center',
            padding: '2vH 1vw 2vH 1vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }

        const inputFieldStyle = {
            width: '80%',
            paddingBottom: '1vw'
        }

        const paragraphStyle = this.props.buttonTitle ? textWhenButtonVisible : textWhenButtonInvisible

        const browseButtonStyle = {
            backgroundColor: '#0069E0',
            color: 'white',
            margin: '1vh 0px 2vh 0px',
        }


        if (this.props.type === "login") {
            return <div>
                {this.props.title ? <Divider /> : null}
                <form style={formParagraphStyle}>
                    {this._renderEmailField(inputFieldStyle)}
                    {this._renderPasswordField(inputFieldStyle)}
                    {this._renderSubmitButton()}
                </form>
            </div>
        } else if (this.props.type === "register") {
            return <div>
                {this.props.title ? <Divider /> : null}
                <form style={formParagraphStyle}>
                    {this._renderEmailField(inputFieldStyle)}
                    {this._renderPasswordField(inputFieldStyle)}
                    {this._renderSubmitButton()}
                </form>
            </div>
        } else {
            return <span>
                {this.props.title ? <Divider /> : null}
                <p style={paragraphStyle}>{this.props.children}</p>
                {this.props.buttonTitle ? <Button style={browseButtonStyle} variant="contained" href={this.props.buttonLink}>{this.props.buttonTitle}</Button> : null}
            </span>
        }
    }

    _renderEmailField(inputFieldStyle) {
        return <TextField style={inputFieldStyle} label="Email" type="email" onChange={(event) => this.onMailChanged(event)} />
    }

    _renderPasswordField(inputFieldStyle) {
        return <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            style={inputFieldStyle}
            onChange={(event) => this.onPasswordChanged(event)}
        />
    }

    _renderSubmitButton() {
        const formButtonStyle = {
            backgroundColor: '#0069E0',
            color: 'white',
            margin: '2vh 0px 0.5vh 0px',
            width: '80%'
        }

        const registerTextStyle = {
            marginBottom: '2vh',
            paddingTop: '1vh',
            color: 'black'
        }

        if (this.props.type === 'login') {
            return <div style={{ width: '100%' }}>
                <Button style={formButtonStyle} variant="contained" onClick={this._performLogin}>Login</Button>
                <div style={registerTextStyle}>or do you need to  <Link to="/register" style={{ color: 'black' }}>register</Link> first?</div>
            </div>
        } else {
            return <div style={{ width: '100%' }}>
                <Button style={formButtonStyle} variant="contained" onClick={this._performRegistration}>Register</Button>
                <div style={registerTextStyle}>You already have an account?  <Link to="/login" style={{ color: 'black' }}>Login</Link> directly.</div>
            </div>
        }
    }

    onMailChanged(event) {
        this.setState({
            mail: event.target.value
        })
    }

    onPasswordChanged(event) {
        this.setState({
            password: event.target.value
        })
    }

    _performLogin() {
        //TODO: Loading indicator
        requestLoginToken(this.state.mail, this.state.password).then((response) => {
            setVerificationToken(response)

        }).catch((error) => {
            console.log(error)
        })
    }

    _performRegistration() {
        //TODO: Data validation, Email check and long password check
        if (isValidEmail(this.state.mail) && isValidPassword(this.state.password)) {
            console.log(`${this.state.mail} is a valid mail.`)
            registerUser(`user-${this.state.mail}`, this.state.password, this.state.mail, "novice")
            //Submit...
        } else {
            console.log(`${this.state.mail} is not a valid mail or ${this.state.password} is not a valid password.`)
            //Error message...
        }
    }
}

export default ECHPaper;