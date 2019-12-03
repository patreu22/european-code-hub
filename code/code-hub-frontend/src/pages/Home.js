import React, { Component } from 'react';
import { Button, Box } from '@material-ui/core';
import Searchbar from '../components/Searchbar';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import EuropeanStars from '../assets/europe_stars.svg';
import * as axios from 'axios';
//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Home extends Component {
    render() {
        const headlineStyling = {
            margin: 0,
            padding: 10,
            paddingTop: '20px',
            color: 'white'
        }

        const subHeadlineStyling = {
            margin: 0,
            padding: 0,
            paddingTop: '20px',
            paddingBottom: '20px',
            color: 'white'
        }

        const heroStyling = {
            backgroundColor: '#004494',
            width: '100vw',
            textAlign: 'center'
        }

        const subHeroStyling = {
            backgroundColor: '#0069E0',
            width: '100vw',
            textAlign: 'center',
            paddingBottom: '30px'
        }

        return (
            < PageWrapper >
                <Box style={heroStyling}>
                    <h1 style={headlineStyling}>One Europe, One Codebase</h1>
                    {this.starsLogo()}
                </Box>
                <Box style={subHeroStyling}>
                    <h3 style={subHeadlineStyling}>Open Source projects for governmental purposes</h3>
                    <div style={{ width: '50%' }} className="center">
                        <Searchbar />
                    </div>
                    <div style={{ paddingTop: '10px', color: 'white' }}>or do you want to  <Link to="/add" style={{ color: 'white' }}>add your own</Link> project?</div>
                </Box>
                <h3>Just want to have a look around?</h3>
                <span>Browse through the full <Link to="/hello">catalogue</Link></span>
                <Button onClick={this._onCreateUser}>Create User</Button>
                <Button onClick={this._onCreateProject}>Create Project</Button>
            </PageWrapper>
        );
    }

    _onCreateUser() {
        console.log("Let's create a user!")
        axios.post('/api/create/user', {
            // gitUrl: 'https://github.com/torvalds/linux',
            // projectName: 'Linux',
            // responsibleInstitution: 'Linux Foundation',
            // contactMail: 'info@linux.com'
            username: 'Linus Torvalds',
            password: '12345',
            mail: 'hi@linux.sw',
            position: 'Linux Guru'
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }

    _onCreateProject() {
        console.log("Let's create a project!")
        axios.post('/api/create/project', {
            gitUrl: 'https://github.com/torvalds/linux',
            projectName: 'Linux',
            responsibleInstitution: 'Linux Foundation',
            contactMail: 'info@linux.com'
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }

    starsLogo() {
        return <img width={'100px'} height={'100px'} src={EuropeanStars} alt="logo" style={{ paddingTop: '10px', paddingBottom: '20px' }} />
    }
}

export default Home;