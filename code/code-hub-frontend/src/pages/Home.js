import '../css/Home.css';
import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import PageWrapper from '../components/PageWrapper';
import ECHSearchHero from '../components/ECHSearchHero';
import ECHPaper from '../components/ECHPaper';
import EuropeanStars from '../assets/europe_stars.svg';
import { CONTRIBUTE } from '../routes';

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Home extends Component {

    starsLogo = <img width={'100vw'} height={'100vw'} src={EuropeanStars} alt="logo" style={{ paddingTop: '10px', paddingBottom: '20px' }} />

    render() {
        return (
            < PageWrapper headlineTitle="The place for European Code" headerContent={this.starsLogo}>
                <ECHSearchHero type="home" />
                <Box flexDirection="row" flex="1" display="flex">
                    <ECHPaper width="29vw" title="Explore!" buttonTitle="Browse the catalogue" buttonLink="/projects">
                        <div>
                            See all the different projects listed on this page. They are all programmed, funded and/or maintained by the administrations of the European Countries.
                        </div>
                    </ECHPaper>
                    <ECHPaper width="29vw" title="Contribute?" buttonTitle="Contribution page" buttonLink={CONTRIBUTE}>
                        <div>
                            Find out how to contribute to this great website. You can make this page more popular by sharing, developing or listing your own projects here.
                        </div>
                    </ECHPaper>
                </Box>
            </PageWrapper >
        );
    }
}

export default Home;