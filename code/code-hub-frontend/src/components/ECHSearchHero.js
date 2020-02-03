import React, { Component, } from 'react';
import { Box, Divider, Paper } from '@material-ui/core';
import ECHSearchbar from './ECHSearchbar';
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

const filterBarStyling = {
    width: '100vw',
    backgroundColor: '#1675E0',
    textAlign: 'center',
    padding: '20px 0 20px 0',
    marginBottom: '20px',
    color: 'white'
}

class ECHSearchHero extends Component {

    render() {
        const type = this.props.type
        if (type === "home") {
            return this._renderMainSearchHero()
        } else if (type === "catalogue") {
            return this._renderCatalogueSearchHero()
        }

    }

    _renderMainSearchHero() {
        console.log(this.props.initialValue)
        return (
            <Paper style={subHeroStyling}>
                <h3 style={subHeadlineStyling}>Find Open Source projects funded by the public</h3>
                <Divider style={dividerStyling} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '5px' }}>
                    <div style={{ width: '80%' }} >
                        <ECHSearchbar initialValue={this.props.initialValue} />
                    </div>
                </div>
                <div style={{ paddingTop: '1vh', color: 'black' }}>or do you want to  <Link to="/add" style={{ color: 'black' }}>add your own</Link> project?</div>
            </Paper>
        );
    }

    _renderCatalogueSearchHero() {
        return (
            <Box style={filterBarStyling}>
                <div style={{ width: '50%' }} className="center">
                    <ECHSearchbar />
                </div>
            </Box>
        );
    }
}

export default ECHSearchHero;