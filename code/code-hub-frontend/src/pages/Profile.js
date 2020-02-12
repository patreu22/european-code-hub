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
import { LOGIN, HOME } from '../routes';
import {
    Group as GroupIcon,
    Person as PersonIcon,
    EmailOutlined as EmailIcon,
} from '@material-ui/icons'
import ECHIconAndText from '../components/ECHIconAndText';

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            shouldRedirectTo: ""
        }
    }

    componentDidMount() {
        const userName = this.props.match.params.username;
        if (userName) {
            this.props.getUserByName(userName)
        } else {
            const username = this.props.match.params.username;
            const cookie = this.props.cookie
            const ownUserDataExists = objectExists(this.props.ownUserData)
            if (!username && !ownUserDataExists && cookie) {
                this.props.getUserByToken(cookie)
            } else if (!cookie) {
                this.setState({ shouldRedirectTo: LOGIN })
            }
        }
    }

    componentDidUpdate() {
        const username = this.props.match.params.username;
        const cookie = this.props.cookie
        const ownUserDataExists = objectExists(this.props.ownUserData)
        if (!username && !ownUserDataExists && cookie) {
            this.props.getUserByToken(cookie)
        } else if (!username && !cookie) {
            this.setState({ shouldRedirectTo: HOME })
        }
    }

    componentWillUnmount() {
        this.props.resetUserData()
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
                <div style={rowStyle}>
                    {<Avatar src={profilePictureBaseString} alt={currentData.username} style={profilePictureStyle} />}
                    {this._renderDetails(currentData)}
                </div>
            </ECHPaper>
        </div >
    }

    _renderDetails(currentData) {
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
