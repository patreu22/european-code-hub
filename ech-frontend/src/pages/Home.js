import '../css/Home.css';
import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import PageWrapper from '../components/PageWrapper';
import ECHSearchHero from '../components/ECHSearchHero';
import ECHPaper from '../components/ECHPaper';
import EuropeanStars from '../assets/europe_stars.svg';
import { CONTRIBUTE } from '../routes';

import MuiAlert from '@material-ui/lab/Alert';

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Home extends Component {

    starsLogo = <img width={'100vw'} height={'100vw'} src={EuropeanStars} alt="logo" style={{ paddingTop: '10px', paddingBottom: '20px' }} />

    constructor(props) {
        super(props)
        this.state = {
            showWarning: true
        }

        this.handleWarningClose = this.handleWarningClose.bind(this)
        this._getAlert = this._getAlert.bind(this)
    }

    render() {
        return (
            <span>
                {this.state.showWarning && this._getAlert()}
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
            </span>
        );
    }

    handleWarningClose = () => this.setState({ showWarning: false })

    _getAlert() {
        return <MuiAlert elevation={5} variant="filled" onClose={this.handleWarningClose} severity="warning">
            ++ Update: 04/02/20 ++ First public test version ++ Data mirrored from Code.gov ++ Traffic not encrypted atm ++ Search and suggestions now enabled ++
        </MuiAlert>
    }

}

export default Home;