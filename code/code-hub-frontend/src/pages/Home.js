import React, { Component } from 'react';
import { Button, Box, Paper, Divider } from '@material-ui/core';
import SearchHero from '../components/SearchHero';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import EuropeanStars from '../assets/europe_stars.svg';

import { registerUser, registerProject } from '../helper/httpHelper';
//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Home extends Component {
    render() {
        const headlineStyling = {
            margin: 0,
            padding: 10,
            paddingTop: '2vh',
            color: 'white'
        }

        const heroStyling = {
            backgroundColor: '#004494',
            width: '100vw',
            textAlign: 'center',
            paddingTop: '1vh'
        }

        const catalogueBoxStyle = {
            alignContent: 'center',
            textAlign: 'center',
            color: 'black',
            marginTop: '4vh',
            marginLeft: '0.5vw',
            marginRight: '0.5vw',
            paddingTop: '1vh',
            backgroundColor: 'F5F5F5',
            width: '29vw',
            maxHeight: '25vH'
        }

        const browseButtonStyle = {
            backgroundColor: '#0069E0',
            color: 'white',
            margin: '3vh 0px 1vh 0px'
        }


        return (
            < PageWrapper >
                <Box style={heroStyling}>
                    <h1 style={headlineStyling}>The place for European Code</h1>
                    {this.starsLogo()}
                </Box>
                <SearchHero type="home" />
                <Box flexDirection="row" flex="1" display="flex">
                    <Paper style={catalogueBoxStyle} border={1}>
                        <h3>Explore!</h3>
                        <Divider />
                        <p style={{ textAlign: 'left', padding: '1vH 1vw 1vH 1vw' }}>See all the different projects listed on this page. They are all programmed, funded and/or maintained by the administrations of the European Countries.</p>
                        <Button style={browseButtonStyle} variant="contained" href="/catalogue">Browse  the catalogue</Button>
                        {/* <Button onClick={this._onCreateUser}>Create User</Button>
                    <Button onClick={this._onCreateProject}>Create Project</Button> */}
                    </Paper>
                    <Paper style={catalogueBoxStyle} border={1}>
                        <h3>Contribute?</h3>
                        <Divider />
                        <p style={{ textAlign: 'left', padding: '1vh 1vw 1vh 1vw' }}>Find out how to contribute to this great website. You can make this page more popular by sharing, developing or listing your own projects here</p>
                        <Button style={browseButtonStyle} variant="contained" href="/catalogue">Contribution page</Button>
                        {/* <Button onClick={this._onCreateUser}>Create User</Button>
                    <Button onClick={this._onCreateProject}>Create Project</Button> */}
                    </Paper>
                </Box>
            </PageWrapper>
        );
    }

    _onCreateUser() {
        console.log("Let's create a user!")
        const password = '12345678';
        registerUser("Steve McStevenson", password, "mymail@mailmy.com", "Coding Ninja")
    }

    _onCreateProject() {
        registerProject({ gitUrl: "gitUrl", projectName: "Awesome Project", projectDescription: "Awesome description", contactMail: "awesome@contact.com" });
    }

    starsLogo() {
        return <img width={'100px'} height={'100px'} src={EuropeanStars} alt="logo" style={{ paddingTop: '10px', paddingBottom: '20px' }} />
    }
}

export default Home;