import React, { Component, } from 'react';
import { Avatar } from '@material-ui/core'
import PageWrapper from '../components/PageWrapper'
import { getUserByName, getUserByToken } from '../actions/httpActions'
import { withRouter, Redirect } from "react-router";
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import ECHPaper from '../components/ECHPaper'
import NotFound from './NotFound'
import { connect } from 'react-redux'
import { objectExists } from '../helper/objectHelper'
import { resetUserData } from '../slices/userSlice'
import { HOME } from '../routes';
import { isValidEmail, isValidText } from '../helper/validationHelper'
import {
    Group as GroupIcon,
    Person as PersonIcon,
    EmailOutlined as EmailIcon,
} from '@material-ui/icons'
import ECHIconAndText from '../components/ECHIconAndText';
import ECHButton from '../components/ECHButton';
import ECHTextfield from '../components/ECHTextfield';

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            shouldRedirectTo: "",
            editMode: true,
            mailChange: '',
            mailError: false,
            mailErrorMessage: '',
            mailDefaultSet: false,
            organizationChange: '',
            organizationError: false,
            organizationErrorMessage: '',
            organizationDefaultSet: false
        }
        this._onUpdateButtonClick = this._onUpdateButtonClick.bind(this)
        this._renderButtonBar = this._renderButtonBar.bind(this)
        this._onSavePressed = this._onSavePressed.bind(this)
        this._onCancelPressed = this._onCancelPressed.bind(this)
        this.onMailChanged = this.onMailChanged.bind(this)
    }

    componentDidMount() {
        const userName = this.props.match.params.username;
        if (userName) {
            this.props.getUserByName(userName)
        } else {
            this._handleDataFetch()
        }
    }

    componentDidUpdate() {
        this._handleDataFetch()
    }

    componentWillUnmount() {
        this.props.resetUserData()
    }

    _handleDataFetch() {
        const username = this.props.match.params.username;
        const cookie = this.props.cookie
        const ownUserDataExists = objectExists(this.props.ownUserData)

        if (this.props.ownUserData && !this.state.mailChange && !this.state.mailDefaultSet) {
            this.setState({ mailChange: this.props.ownUserData.mail, mailDefaultSet: true })
        }

        if (this.props.ownUserData && !this.state.organizationChange && !this.state.organizationDefaultSet) {
            if (this.props.ownUserData.organization) {
                this.setState({ organizationChange: this.props.ownUserData.organization, organizationDefaultSet: true })
            }
        }

        if (!username && !ownUserDataExists && cookie) {
            if (objectExists(this.props.currentUserData)) {
                this.props.resetUserData()
            }
            this.props.getUserByToken(cookie)
        } else if (!username && !cookie) {
            this.setState({ shouldRedirectTo: HOME })
        }
    }

    render() {
        const error = this.props.error
        if (error) {
            if (error.code === 404) {
                return <NotFound />
            }
        }

        if (this.state.shouldRedirectTo) {
            return <Redirect to={this.state.shouldRedirectTo} />
        }

        const currentData = objectExists(this.props.currentUserData)
            ? this.props.currentUserData
            : this.props.ownUserData

        const content = this.props.isLoading
            ? <ECHLoadingIndicator />
            : this.renderProfile(currentData)

        const displayName = currentData.username
            ? `${currentData.username}'s`
            : ""

        return (
            <PageWrapper headlineTitle={`${displayName} Profile`} showBackButton={true}>
                {content}
            </PageWrapper>
        );
    }

    renderProfile(currentData) {
        const profilePictureStyle = {
            width: '25%',
            height: '70%'
        }
        const rowStyle = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }

        const flexContainer = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 0,
            width: '85vw',
            marginTop: '1vh',
            justifyContent: 'center'
        };

        var profilePictureData = ""
        if (currentData.profilePicture) {
            profilePictureData = currentData.profilePicture.data.data
        }
        const profilePictureBaseString = "data:image/png;base64," + btoa(new Uint8Array(profilePictureData).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));

        return <div style={flexContainer}>
            <ECHPaper width="80%">
                <div>
                    <div style={rowStyle}>
                        {<Avatar src={profilePictureBaseString} alt={currentData.username} style={profilePictureStyle} />}
                        {this._renderDetails(currentData)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {this._renderButtonBar()}
                    </div>
                </div>
            </ECHPaper>
        </div >
    }

    _renderButtonBar() {
        if (this.props.ownUserData) {
            if (this.state.editMode) {
                return <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ display: 'inline-block', paddingRight: '20px' }}>
                        <ECHButton onClick={this._onSavePressed}>Save changes</ECHButton>
                    </div>
                    <ECHButton onClick={this._onCancelPressed}>Cancel</ECHButton>
                </div >
            } else {
                return <ECHButton onClick={this._onUpdateButtonClick}>Update profile</ECHButton>
            }
        } else {
            return null
        }
    }

    _onSavePressed() {
        if (!(this.state.mailError || this.state.organizationError)) {
            console.log("TODO: Send to backend")
            this.setState({ editMode: false })
        }
    }

    _onCancelPressed() {
        this.setState({
            editMode: false,
            mailChange: '',
            mailError: false,
            mailErrorMessage: '',
            mailDefaultSet: false,
            organizationChange: '',
            organizationError: false,
            organizationErrorMessage: '',
            organizationDefaultSet: false
        })
    }

    _onUpdateButtonClick() {
        this.setState({ editMode: true })
    }

    _renderDetails(currentData) {
        if (this.state.editMode) {
            return <ECHPaper title="Details" width="70%">
                <div>
                    <ECHIconAndText
                        icon={<PersonIcon />}
                        text={currentData.username}
                        tooltipText="Username"
                    />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ alignSelf: 'center', display: 'inline-block', paddingRight: '5px' }}><EmailIcon /></div>
                        <ECHTextfield
                            label="Email"
                            onChange={(event) => this.onMailChanged(event)}
                            onBlur={(event) => this.onMailFieldBlurred(event)}
                            error={this.state.mailError}
                            helperText={this.state.mailErrorMessage}
                            value={this.state.mailChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ alignSelf: 'center', display: 'inline-block', paddingRight: '5px' }}><EmailIcon /></div>
                        <ECHTextfield
                            label="Organization"
                            onChange={(event) => this.onOrganizationChanged(event)}
                            onBlur={(event) => this.onOrganizationFieldBlurred(event)}
                            error={this.state.organizationError}
                            helperText={this.state.organizationErrorMessage}
                            value={this.state.organizationChange}
                        />
                    </div>
                </div>
            </ECHPaper>
        } else {
            return <ECHPaper title="Details" width="70%">
                <div>
                    <ECHIconAndText
                        icon={<PersonIcon />}
                        text={currentData.username}
                        tooltipText="Username"
                    />
                    <ECHIconAndText
                        icon={<EmailIcon />}
                        text={currentData.mail}
                        link={`mailto:${currentData.mail}`}
                        tooltipText="Email"
                    />
                    <ECHIconAndText
                        icon={<GroupIcon />}
                        text={currentData.organization}
                        tooltipText="Organization"
                    />
                </div>
            </ECHPaper>
        }
    }

    onMailChanged(event) {
        this.setState({
            mailChange: event.target.value,
            mailError: false,
            mailErrorMessage: "",
        })
    }

    onMailFieldBlurred(event) {
        const isValid = isValidEmail(event.target.value)
        this.setState({
            mailError: !isValid,
            mailErrorMessage: isValid ? "" : "Invalid Email address"
        })
    }

    onOrganizationChanged(event) {
        this.setState({
            organizationChange: event.target.value,
            organizationError: false,
            organizationErrorMessage: "",
        })
    }

    onOrganizationFieldBlurred(event) {
        const isValid = isValidText(event.target.value)
        this.setState({
            organizationError: !isValid,
            organizationErrorMessage: isValid ? "" : "Invalid organization"
        })
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.user.isLoading,
        cookie: state.user.cookie,
        currentUserData: state.user.currentUserData,
        ownUserData: state.user.ownUserData,
        error: state.user.error
    }
}

const mapDispatchToProps = { getUserByName, getUserByToken, resetUserData }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
