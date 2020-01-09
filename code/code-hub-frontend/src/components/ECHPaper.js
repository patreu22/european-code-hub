import React, { Component, } from 'react';
import { Button, Divider, Paper, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { registerUser } from '../helper/httpHelper'
import { isValidEmail, isValidPassword } from '../helper/validationHelper'
import { requestLoginToken } from '../helper/httpHelper'
import { setVerificationToken } from '../helper/cookieHelper'
import ImageUploader from 'react-images-upload';

class ECHPaper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            password: '',
            profileImage: null
        };

        this._performLogin = this._performLogin.bind(this)
        this._performRegistration = this._performRegistration.bind(this)
        this.onDrop = this.onDrop.bind(this);
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

        const dropzoneWrapperStyle = {
            maxWidth: '80%',
            paddingBottom: '1vw',
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
                    {/* TODO: Padding hinzufügen */}
                    <div style={dropzoneWrapperStyle}>
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose a profile picture'
                            withPreview
                            label="optional"
                            onChange={this.onDrop}
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
        } else {
            return <span>
                {this.props.title ? <Divider /> : null}
                <p style={paragraphStyle}>{this.props.children}</p>
                {this.props.buttonTitle ? <Button style={browseButtonStyle} variant="contained" href={this.props.buttonLink}>{this.props.buttonTitle}</Button> : null}
            </span>
        }
    }

    onDrop(pictureFiles) {
        this.setState({
            profileImage: pictureFiles[0],
        });
    }

    _onDropzoneChanged(files) {
        var image = null;
        if (!files.isEmpty) {
            image = files[0]
        }
        this.setState({
            profileImage: image
        });
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
            onKeyDown={(e) => this._handleKeyDown(e, this.props)}
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
        requestLoginToken(this.state.mail, this.state.password).then((token) => {
            setVerificationToken(token)
            console.log(token)
        }).catch((error) => {
            console.log(error)
        })
    }

    async _performRegistration() {
        //TODO: Data validation, Email check and long password check
        if (isValidEmail(this.state.mail) && isValidPassword(this.state.password)) {
            console.log(`${this.state.mail} is a valid mail.`)
            await registerUser(`user-${this.state.mail}`, this.state.password, this.state.mail, "novice", this.state.profileImage);
        } else {
            console.log(`${this.state.mail} is not a valid mail or ${this.state.password} is not a valid password.`)
            //Error message...
        }
    }

    _handleKeyDown(event, props) {
        if (event.key === 'Enter') {
            if (this.props.type === "login") {
                this._performLogin()
            } else if (this.props.type === "register") {
                this._performRegistration();
            }

        }
    }
}

export default ECHPaper;