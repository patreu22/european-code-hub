import React, { Component, } from 'react';
import { Box } from '@material-ui/core'

class ECHFilterBar extends Component {

    render() {
        const filterBarStyling = {
            backgroundColor: '#1675E0',
            display: 'block',
            width: '100vw',
            textAlign: 'center',
            padding: '20px 0 20px 0'
        }
        return (
            <Box style={filterBarStyling}>This is a filter bar</Box>
        );
    }
}

export default ECHFilterBar;