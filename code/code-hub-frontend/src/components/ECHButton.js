import React, { Component } from 'react';
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

class ECHButton extends Component {

    render() {
        const buttonStyle = {
            backgroundColor: '#0069E0',
            color: 'white',
            margin: '2vh 0px 2vh 0px',
            width: this.props.width
        }

        return (
            <Button
                style={buttonStyle}
                variant="contained"
                color="primary"
                component={Link}
                to={this.props.buttonLink}
                onClick={this.props.onClick}>
                {this.props.children}
            </Button>
        );

    }
}

export default ECHButton;