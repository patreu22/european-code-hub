import React, { Component, } from 'react';
import { CircularProgress } from '@material-ui/core'

class ECHLoadingIndicator extends Component {
    render() {
        return (
            <CircularProgress className="center" color="secondary" />
        );
    }
}

export default ECHLoadingIndicator;