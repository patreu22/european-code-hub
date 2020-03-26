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

        if (this.props.buttonLink) {
            return (
                <Button
                    style={buttonStyle}
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={this.props.buttonLink}
                    href={this.props.href}
                    onClick={this.props.onClick}>
                    {this.props.children}
                </Button>
            );
        } else if (this.props.href) {
            return (
                <Button
                    style={buttonStyle}
                    variant="contained"
                    color="primary"
                    href={this.props.href}
                    onClick={this.props.onClick}>
                    {this.props.children}
                </Button>
            );
        } else {
            return (
                <Button
                    style={buttonStyle}
                    variant="contained"
                    color="primary"
                    onClick={this.props.onClick}>
                    {this.props.children}
                </Button>
            )
        }



    }
}

export default ECHButton;