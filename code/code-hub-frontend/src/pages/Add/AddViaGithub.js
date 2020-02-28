import React, { Component, } from 'react';
import { Divider } from '@material-ui/core'
import { connect } from 'react-redux'
import PageWrapper from '../../components/PageWrapper'
import ECHPaper from '../../components/ECHPaper'
import ECHLoadingIndicator from '../../components/ECHLoadingIndicator'
import ECHTextfield from '../../components/ECHTextfield'
import ECHButton from '../../components/ECHButton'
import { Redirect } from 'react-router-dom'
import { LOGIN } from '../../routes'
import { isValidUrl } from '../../helper/validationHelper'
import { getInfoFromGitRepo } from '../../actions/httpActions'

class AddViaGithub extends Component {

    constructor(props) {
        super(props)
        this.state = {
            gitUrl: 'https://github.com/rexxars/react-markdown',
            gitUrlError: false,
            gitUrlErrorMessage: '',
            gitHeight: 0
        }
        this._performGitFetch = this._performGitFetch.bind(this)
    }

    componentDidMount() {
        if (this.state.gitHeight === 0) {
            if (document.getElementById("gitContainer")) {
                const height = document.getElementById("gitContainer").clientHeight;
                this.setState({ gitHeight: height })
            }
        }
    }

    render() {
        if (this.props.cookie) {
            return <PageWrapper headlineTitle={"Add project via Github repository"} showBackButton={true}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ECHPaper title="Enter URL" width="40vw">
                        {this._renderContent()}
                    </ECHPaper>
                </div>
            </PageWrapper>
        } else {
            return <Redirect to={LOGIN} />
        }
    }

    _renderContent() {
        if (this.props.isLoading) {
            return <div style={{ height: this.state.gitHeight, display: 'flex', justifyContent: 'center' }}>
                <ECHLoadingIndicator />
            </div>
        } else {
            const formParagraphStyle = {
                textAlign: 'center',
                padding: '2vH 1vw 2vH 1vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }
            return <div id="gitContainer">
                {this.props.title ? <Divider /> : null}
                <form style={formParagraphStyle}>
                    {this._renderUrlField()}
                    {this._renderSubmitButton()}
                </form>
            </div >
        }
    }

    _renderSubmitButton() {
        return <div style={{ width: '100%' }}>
            <ECHButton width="80%" onClick={this._performGitFetch}>Next step</ECHButton>
        </div>
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

    onUrlChanged(event) {
        this.setState({
            gitUrl: event.target.value,
            gitUrlError: false,
            gitUrlErrorMessage: "",
        })
    }

    onUrlFieldBlurred(event) {
        const isValid = isValidUrl(event.target.value)
        this.setState({
            gitUrlError: !isValid,
            gitUrlErrorMessage: isValid ? "" : "Invalid URL"
        })
    }

    //TODO: Git fetch
    _performGitFetch() {
        const validUrl = isValidUrl(this.state.gitUrl)
        if (validUrl) {
            this.props.getInfoFromGitRepo(this.state.gitUrl)
        } else {
            this.setState({
                gitUrlError: true,
                gitUrlErrorMessage: "Invalid URL"
            })
        }
    }
}

const mapStateToProps = state => {
    return {
        cookie: state.user.cookie,
        isLoading: state.createProject.isLoading
    }
}

const mapDispatchToProps = { getInfoFromGitRepo }

export default connect(mapStateToProps, mapDispatchToProps)(AddViaGithub);
