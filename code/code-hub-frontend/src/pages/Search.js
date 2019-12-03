import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import Searchbar from '../components/Searchbar';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';

class Search extends Component {
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
                    <h3 style={subHeadlineStyling}>Open Source projects for governmental purposes</h3>
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

export default Search;