import React, { Component, } from 'react';
import { Box } from '@material-ui/core'

class ECHFilterBar extends Component {

    render() {
        const filterBarStyling = {
            width: '100vw',
            backgroundColor: '#1675E0',
            textAlign: 'center',
            padding: '20px 0 20px 0',
            marginBottom: '20px',
            color: 'white'
        }

        return (
            <Box style={filterBarStyling}>This is a filter bar</Box>
        );
    }
}

export default ECHFilterBar;