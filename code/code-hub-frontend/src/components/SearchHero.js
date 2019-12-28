import React, { Component, } from 'react';
import { Divider, Paper } from '@material-ui/core';
import Searchbar from './Searchbar';
import { Link } from 'react-router-dom'

const subHeadlineStyling = {
    margin: 0,
    padding: 0,
    paddingTop: '2vh',
    paddingBottom: '2vh',
    color: 'black'
}

const subHeroStyling = {
    backgroundColor: 'F5F5F5',
    width: '60vw',
    textAlign: 'center',
    paddingBottom: '3vh',
    margin: '5vh 2vh 2vh 2vh'
}

const dividerStyling = {
    margin: '1vh 0 3vh 0'
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
            <Paper style={subHeroStyling}>
                <h3 style={subHeadlineStyling}>Find Open Source projects funded by the public</h3>
                <Divider style={dividerStyling} />
                <div style={{ width: '50%' }} className="center">
                    <Searchbar />
                </div>
                <div style={{ paddingTop: '1vh', color: 'black' }}>or do you want to  <Link to="/add" style={{ color: 'black' }}>add your own</Link> project?</div>
            </Paper>
        );
    }

    _renderCatalogueSearchHero() {
        return (
            <Paper style={subHeroStyling}>
                <h3 style={subHeadlineStyling}>Searching for something more specific?</h3>
                <div style={{ width: '50%' }} className="center">
                    <Searchbar />
                </div>
            </Paper>
        );
    }
}

export default SearchHero;