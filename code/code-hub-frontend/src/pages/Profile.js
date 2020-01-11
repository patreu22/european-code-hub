import React, { Component, } from 'react';
import { Avatar, CircularProgress } from '@material-ui/core'
import PageWrapper from '../components/PageWrapper'
import { Redirect } from 'react-router-dom'
import { getVerificationToken } from '../helper/cookieHelper'
import { getOwnUserData, getUserData } from '../helper/httpHelper'
import { withRouter } from "react-router";

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            redirectToLogin: false,
            isLoading: false,
            mail: '',
            position: '',
            profilePicture: null,
        }
    }

    componentDidMount() {
        const token = getVerificationToken()
        if (typeof token === 'undefined' || token === '') {
            this.setState({
                redirectToLogin: true
            })
        } else {
            this.setState({ isLoading: true })
            this.fetchData()
        }
    }

    fetchData() {
        const userToFetchData = this.props.match.params.user ? this.props.match.params.mail : ""
        console.log(userToFetchData)
        if (userToFetchData === "") {
            console.log("User to fetch data: " + userToFetchData)
            getOwnUserData().then(data => {
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
        } else {
            //TODO: Change to user
            getUserData({ mail: userToFetchData }).then(data => {
                console.log(data)
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
                console.log(err)
                const isUserNotFound = err.response.status === 404
                this.setState({ isLoading: false, redirectToLogin: isUserNotFound })
            })
        }
    }


    render() {
        if (!this.state.redirectToLogin) {
            const content = this.state.isLoading ? <CircularProgress className="center" color="secondary" /> : this.renderProfile()
            return (
                <PageWrapper headlineTitle="Profile">
                    {content}
                </PageWrapper>
            );
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