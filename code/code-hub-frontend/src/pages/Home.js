import '../css/Home.css';
import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import PageWrapper from '../components/PageWrapper';
import SearchHero from '../components/SearchHero';
import ECHPaper from '../components/ECHPaper';
import EuropeanStars from '../assets/europe_stars.svg';

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Home extends Component {

    render() {
        return (
            < PageWrapper headlineTitle="The place for European Code" headerContent={this.starsLogo()}>
                <SearchHero type="home" />
                <Box flexDirection="row" flex="1" display="flex">
                    <ECHPaper title="Explore!" buttonTitle="Browse the catalogue" buttonLink="/projects">
                        See all the different projects listed on this page. They are all programmed, funded and/or maintained by the administrations of the European Countries.
                    </ECHPaper>
                    <ECHPaper title="Contribute?" buttonTitle="Contribution page" buttonLink="/contribute">
                        Find out how to contribute to this great website. You can make this page more popular by sharing, developing or listing your own projects here.
                    </ECHPaper>
                </Box>
            </PageWrapper >
        );
    }

    //TODO: Make Image responsive
    starsLogo() {
        return <img width={'100px'} height={'100px'} src={EuropeanStars} alt="logo" style={{ paddingTop: '10px', paddingBottom: '20px' }} />
    }
}

export default Home;