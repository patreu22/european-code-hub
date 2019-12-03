import React, { Component } from 'react';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import { Link } from 'react-router-dom';
import Searchbar from '../components/Searchbar';
import { Box } from '@material-ui/core';

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Catalogue extends Component {
    render() {
        const subHeadlineStyling = {
            margin: 0,
            padding: 0,
            paddingTop: '20px',
            paddingBottom: '20px',
            color: 'white'
        }

        const subHeroStyling = {
            backgroundColor: '#0069E0',
            width: '100vw',
            textAlign: 'center',
            paddingBottom: '30px'
        }

        return (
            < PageWrapper >
                <Box style={subHeroStyling}>
                    <h3 style={subHeadlineStyling}>Full catalogue</h3>
                    <div style={{ width: '50%' }} className="center">
                        <Searchbar />
                    </div>
                    <div style={{ paddingTop: '10px', color: 'white' }}>or do you want to  <Link to="/add" style={{ color: 'white' }}>add your own</Link> project?</div>
                </Box>
                <h3>Just want to have a look around?</h3>
                <span>Browse through the full <Link to="/catalogue">catalogue</Link></span>
            </PageWrapper >
        );
    }
}

export default Catalogue;