import React, { Component, } from 'react';
import { Avatar } from '@material-ui/core'
import PageWrapper from '../components/PageWrapper'
import { Redirect } from 'react-router-dom'
import { getVerificationToken } from '../helper/cookieHelper'
import { getOwnUserData, getUserData } from '../helper/httpHelper'
import { withRouter } from "react-router";
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            redirectToLogin: false,
            redirectToOwnProfile: false,
            myusername: '',
            isLoading: false,
            isOwnProfile: false,
            mail: '',
            position: '',
            profilePicture: null,
        }
    }

    componentDidMount() {
        const token = getVerificationToken()
        if ((typeof token === 'undefined' || token === '') && !this.props.match.params.username) {
            // TODO: Redirect to Error 404: Not found page
            this.setState({
                redirectToLogin: true
            })
        } else {
            if (this.props.match.params.username) {
                this.setState({ isLoading: true })
                this.fetchUserData();
            } else {
                this.setState({
                    isLoading: true,
                    isOwnProfile: true
                })
                this.fetchOwnUserData();
            }
        }
    }

    fetchOwnUserData() {
        this.handleReceivedData(getOwnUserData)
    }

    fetchUserData() {
        const userToFetchData = this.props.match.params.username
        //TODO: Change to username instead of email
        const fetchPromise = () => getUserData({ username: userToFetchData })
        this.handleReceivedData(fetchPromise)
    }

    handleReceivedData(promise) {
        promise().then(data => {
            var imageBaseString = "data:image/png;base64," + btoa(new Uint8Array(data.profilePicture.data.data).reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
            }, ''));
            this.setState({
                username: data.username,
                mail: data.mail,
                position: data.position,
                profilePicture: imageBaseString,
                isLoading: false
            })
        }).catch(err => {
            const userNotFound = err.response.status === 404
            this.setState({ isLoading: false, redirectToLogin: userNotFound })
        })
    }

    render() {
        if (!this.state.redirectToLogin) {
            const content = this.state.isLoading ? <ECHLoadingIndicator /> : this.renderProfile()
            return (
                <PageWrapper headlineTitle="Profile">
                    {content}
                </PageWrapper>
            );
        } else if (this.state.redirectToOwnProfile) {
            return <Redirect to={`/user/${this.state.myusername}`} />
        } else {
            return <Redirect to='/login' />
        }
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

        return <div style={contentWrapperStyle}>
            <div style={rowStyle}>
                {this.state.profilePicture && <Avatar src={this.state.profilePicture} alt="Profile Image" style={profilePictureStyle} />}
                <div style={profileTextStyle}>
                    <h2>Username: {this.state.username}</h2>
                    <h2>Mail: {this.state.mail}</h2>
                    <h2>Position: {this.state.position}</h2>
                </div>
            </div>
        </div>
    }
}

export default withRouter(Profile);