import '../css/Home.css';
import React, { Component } from 'react';
import { Button, Box, Paper, Divider } from '@material-ui/core';
import PageWrapper from '../components/PageWrapper';
import SearchHero from '../components/SearchHero';
import ECHPaper from '../components/ECHPaper';
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


        return (
            < PageWrapper >
                <Box style={heroStyling}>
                    <h1 style={headlineStyling}>The place for European Code</h1>
                    {this.starsLogo()}
                </Box>
                <SearchHero type="home" />
                <Box flexDirection="row" flex="1" display="flex">
                    <ECHPaper title="Explore!" buttonTitle="Browse the catalogue" buttonLink="/catalogue">
                        See all the different projects listed on this page. They are all programmed, funded and/or maintained by the administrations of the European Countries.
                    </ECHPaper>
                    <ECHPaper title="Contribute?" buttonTitle="Contribution page" buttonLink="/contribute">
                        Find out how to contribute to this great website. You can make this page more popular by sharing, developing or listing your own projects here.
                    </ECHPaper>
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