import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper'
import { withCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            redirectToLogin: false
        }
    }

    componentDidMount() {
        const token = this.props.cookies.get('token')
        if (typeof token === 'undefined' || token === 'undefined') {
            this.setState({
                redirectToLogin: true
            })
        }
    }


    render() {
        if (!this.state.redirectToLogin) {
            return (
                <PageWrapper headlineTitle="Profile...">
                    <h1>Great stuff tbc...</h1>
                </PageWrapper>
            );
        } else {
            return <Redirect to='/login' />
        }

    }
}

export default withCookies(Profile);