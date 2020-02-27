import React, { Component, } from 'react';
import { Avatar, ListItem, List } from '@material-ui/core'
import PageWrapper from '../components/PageWrapper'
import { getUserByName, getUserByToken } from '../actions/httpActions'
import { withRouter, Redirect } from "react-router";
import ImageUploader from 'react-images-upload';
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import ECHPaper from '../components/ECHPaper'
import NotFound from './NotFound'
import { connect } from 'react-redux'
import { objectExists } from '../helper/objectHelper'
import { updateUser } from '../helper/httpHelper'
import { setVerificationCookieAndProfileImageAndUserNameInStore, getUserProjectsByName } from '../actions/httpActions'
import { resetUserData, updateUserData_BEGIN, updateUserData_SUCCESS, updateUserData_FAILURE } from '../slices/userSlice'
import { HOME } from '../routes';
import { isValidEmail, isValidText } from '../helper/validationHelper'
import {
    Group as GroupIcon,
    Person as PersonIcon,
    EmailOutlined as EmailIcon,
    Edit as EditIcon
} from '@material-ui/icons'
import { getVerificationToken } from '../helper/cookieHelper'
import ECHIconAndText from '../components/ECHIconAndText';
import ECHButton from '../components/ECHButton';
import ECHTextfield from '../components/ECHTextfield';
import { PROJECTS } from '../routes'

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            shouldRedirectTo: "",
            editMode: false,
            mailChange: '',
            mailError: false,
            mailErrorMessage: '',
            mailDefaultSet: false,
            organizationChange: '',
            organizationError: false,
            organizationErrorMessage: '',
            organizationDefaultSet: false,
            profileImageChange: undefined,
            fetchedUserProjects: false,
            checkedForUserProjects: false
        }
        this._onUpdateButtonClick = this._onUpdateButtonClick.bind(this)
        this._renderButtonBar = this._renderButtonBar.bind(this)
        this._onSavePressed = this._onSavePressed.bind(this)
        this._onCancelPressed = this._onCancelPressed.bind(this)
        this.onMailChanged = this.onMailChanged.bind(this)
        this.onImageDrop = this.onImageDrop.bind(this)
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        if (username) {
            this.props.getUserByName(username)
            this.props.getUserProjectsByName(username)
            this.setState({ checkedForUserProjects: true })
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
        const userProjectsExist = this.props.userProjects.length > 0

        if (ownUserDataExists && !this.state.mailChange && !this.state.mailDefaultSet) {
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
        } else if (!username && !getVerificationToken()) {
            this.setState({ shouldRedirectTo: HOME })
        }


        if (!userProjectsExist && !this.state.checkedForUserProjects) {
            if (username) {
                this.props.getUserProjectsByName(username)
                this.setState({ checkedForUserProjects: true })
            } else if (this.props.username) {
                this.props.getUserProjectsByName(this.props.username)
                this.setState({ checkedForUserProjects: true })
            }
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

        return <div style={flexContainer}>
            <ECHPaper width="80%">
                <div>
                    <div style={rowStyle}>
                        {this._renderProfileImage(currentData)}
                        {this._renderDetails(currentData)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {this._renderButtonBar()}
                    </div>
                </div>
            </ECHPaper>
            {this._renderProjectList()}
        </div >
    }

    _renderProjectList() {
        if (this.props.userProjects.length > 0) {
            const listElements = this.props.userProjects.map((project, index) => this.getListRow(project, index))
            return <ECHPaper title="Projects added by this user" width="80%">
                <List>{listElements}</List>
            </ECHPaper>
        } else {
            return null
        }
    }

    getListRow(project, index) {
        return <ListItem key={index}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <a href={`${PROJECTS}/${project.projectName}`}>
                    {project.projectName}
                </a>
                <ECHIconAndText
                    icon={<a href={`${PROJECTS}/${project.projectName}/edit`} ><EditIcon style={{ cursor: 'pointer' }} /></a>} //onClick={() => this._onProjectEditClick(project.projectName)} />}
                    tooltipText="Edit project"
                />
            </div>
        </ListItem>
    }

    _renderProfileImage(currentData) {
        const profilePictureStyle = {
            width: '200px',
            height: '200px',
        }

        if (currentData.profilePicture) {
            if (currentData.profilePicture.data) {
                const profileImagePicture = "data:image/png;base64," + btoa(new Uint8Array(currentData.profilePicture.data.data).reduce(function (data, byte) {
                    return data + String.fromCharCode(byte);
                }, ''));
                return <Avatar src={profileImagePicture} alt={currentData.username} style={profilePictureStyle} />
            } else {
                return <Avatar src={currentData.profilePicture} alt={currentData.username} style={profilePictureStyle} />
            }
        } else {
            return <Avatar src={currentData.profilePicture} alt={currentData.username} style={profilePictureStyle} />
        }
    }

    _renderButtonBar() {
        const currentUserDataExists = objectExists(this.props.currentUserData)
        const currentUserIsLoggedInUser = currentUserDataExists
            ? this.props.currentUserData.username === this.props.username
            : false
        if (objectExists(this.props.ownUserData) || currentUserIsLoggedInUser) {
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
            var fieldsToUpdate = {}
            if (this.state.mailChange !== this.props.ownUserData.mail) {
                fieldsToUpdate["mail"] = this.state.mailChange
            }
            if (this.state.organizationChange !== this.props.ownUserData.organization) {
                fieldsToUpdate["organization"] = this.state.organizationChange
            }
            if (this.state.profileImageChange) {
                fieldsToUpdate["profileImageFile"] = this.state.profileImageChange
            }
            if (objectExists(fieldsToUpdate)) {
                updateUser(this.props.cookie, fieldsToUpdate)
                    .then((updated) => {
                        updated
                            ? this.props.getUserByToken(this.props.cookie)
                            : this.props.updateUserData_FAILURE()
                        this.props.setVerificationCookieAndProfileImageAndUserNameInStore(this.props.cookie)
                        this.setState({ editMode: false })
                    })
                    .catch(err => {
                        this.props.updateUserData_FAILURE()
                        this.setState({ editMode: false })
                    })
            } else {
                this.setState({ editMode: false })
            }
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
            return <ECHPaper title="Details" width="73%">
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
                        <div style={{ alignSelf: 'center', display: 'inline-block', paddingRight: '5px' }}><GroupIcon /></div>
                        <ECHTextfield
                            label="Organization"
                            onChange={(event) => this.onOrganizationChanged(event)}
                            onBlur={(event) => this.onOrganizationFieldBlurred(event)}
                            error={this.state.organizationError}
                            helperText={this.state.organizationErrorMessage}
                            value={this.state.organizationChange}
                        />
                    </div>
                    <ImageUploader
                        withIcon={true}
                        buttonText='Choose your profile picture'
                        withPreview
                        label="You can update your profile picture here"
                        onChange={this.onImageDrop}
                        accept="accept=image/*"
                        singleImage={true}
                        maxFileSize={5242880}
                        disable={this.state.profileImage}
                        buttonStyles={{ display: this.state.profileImage ? 'none' : 'block' }}
                    />
                </div>
            </ECHPaper>
        } else {
            return <ECHPaper title="Details" width="73%">
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

    onImageDrop(pictureFiles) {
        this.setState({
            profileImageChange: pictureFiles[0],
        });
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
        isLoadingProjects: state.user.isLoadingProjects,
        cookie: state.user.cookie,
        currentUserData: state.user.currentUserData,
        ownUserData: state.user.ownUserData,
        username: state.user.username,
        error: state.user.error,
        userProjects: state.user.userProjects
    }
}

const mapDispatchToProps = {
    setVerificationCookieAndProfileImageAndUserNameInStore,
    getUserByName,
    getUserByToken,
    resetUserData,
    updateUserData_BEGIN,
    updateUserData_FAILURE,
    updateUserData_SUCCESS,
    getUserProjectsByName
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
