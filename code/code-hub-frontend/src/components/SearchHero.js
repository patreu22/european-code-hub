import React, { Component, } from 'react';
import { Box } from '@material-ui/core';
import Searchbar from './Searchbar';
import { Link } from 'react-router-dom'

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

class SearchHero extends Component {

    render() {
        const type = this.props.type
        if (type === "home") {
            return this._renderMainSearchHero()
        } else if (type === "catalogue") {
            return this._renderCatalogueSearchHero()
        }

    }

    _renderMainSearchHero() {
        return (
            <Box style={subHeroStyling}>
                <h3 style={subHeadlineStyling}>Open Source projects for governmental purposes</h3>
                <div style={{ width: '50%' }} className="center">
                    <Searchbar />
                </div>
                <div style={{ paddingTop: '10px', color: 'white' }}>or do you want to  <Link to="/add" style={{ color: 'white' }}>add your own</Link> project?</div>
            </Box>
        );
    }

    _renderCatalogueSearchHero() {
        return (
            <Box style={subHeroStyling}>
                <h3 style={subHeadlineStyling}>Searching for something more specific?</h3>
                <div style={{ width: '50%' }} className="center">
                    <Searchbar />
                </div>
            </Box>
        );
    }
}

export default SearchHero;