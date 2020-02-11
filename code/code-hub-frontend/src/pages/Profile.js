import React, { Component, } from 'react';
import { Avatar } from '@material-ui/core'
import PageWrapper from '../components/PageWrapper'
import { getUserByName, getUserByToken } from '../actions/httpActions'
import { withRouter, Redirect } from "react-router";
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import NotFound from './NotFound'
import { connect } from 'react-redux'
import { objectExists } from '../helper/objectHelper'
import { resetUserData } from '../slices/userSlice'
import { LOGIN, HOME } from '../routes';

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

        const content = this.props.isLoading
            ? <ECHLoadingIndicator />
            : this.renderProfile()

        return (
            <PageWrapper headlineTitle="Profile" showBackButton={true}>
                {content}
            </PageWrapper>
        );
    }

    renderProfile() {
        const profilePictureStyle = {
            height: '15vw',
            width: '15vw'
        }
        const contentWrapperStyle = {
            margin: '3vH 0 3vH 0',
            textAlign: 'left',
            width: '95vw'
        }
        const rowStyle = {
            display: 'flex',
            flexDirection: 'row'
        }
        const profileTextStyle = {
            display: 'flex',
            flexDirection: 'column',
            padding: '0 3vw 0 3vw'
        }

        const currentData = objectExists(this.props.currentUserData)
            ? this.props.currentUserData
            : this.props.ownUserData

        var profilePictureData = ""
        if (currentData.profilePicture) {
            profilePictureData = currentData.profilePicture.data.data
        }
        const profilePictureBaseString = "data:image/png;base64," + btoa(new Uint8Array(profilePictureData).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));

        return <div style={contentWrapperStyle}>
            <div style={rowStyle}>
                {<Avatar src={profilePictureBaseString} alt={currentData.username} style={profilePictureStyle} />}
                <div style={profileTextStyle}>
                    <h2>Username: {currentData.username}</h2>
                    <h2>Mail: {currentData.mail}</h2>
                    <h2>Organization: {currentData.organization}</h2>
                </div>
            </div>
        </div>
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
