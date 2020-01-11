import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper'
import { Redirect } from 'react-router-dom'
import { getVerificationToken } from '../helper/cookieHelper'
import { getOwnUserData } from '../helper/httpHelper'

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
            getOwnUserData().then(data => {
                var imageBaseString = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, data.profilePicture.data.data));
                this.setState({
                    username: data.username,
                    mail: data.mail,
                    position: data.position,
                    profilePicture: imageBaseString,
                    isLoading: false
                })
            }).catch(err => {
                this.setState({ isLoading: false })
                console.log(err)
            })
        }
    }


    render() {
        if (!this.state.redirectToLogin) {
            return (
                <PageWrapper headlineTitle="Profile...">
                    <h2>Username: {this.state.username}</h2>
                    <h2>Mail: {this.state.mail}</h2>
                    <h2>Position: {this.state.position}</h2>
                    {this.state.profilePicture && <img src={this.state.profilePicture} alt="Profile" />}
                </PageWrapper>
            );
        } else {
            return <Redirect to='/login' />
        }

    }
}

export default Profile;