import React, { Component, } from 'react';
import { Button, Paper, Divider } from '@material-ui/core';

class ECHPaper extends Component {
    render() {
        const catalogueBoxStyle = {
            alignContent: 'center',
            textAlign: 'center',
            color: 'black',
            marginTop: '4vh',
            marginLeft: '0.5vw',
            marginRight: '0.5vw',
            marginBottom: '4vH',
            paddingTop: '1vh',
            backgroundColor: 'F5F5F5',
            width: '29vw',
            alignSelf: 'baseline'
        }
        const browseButtonStyle = {
            backgroundColor: '#0069E0',
            color: 'white',
            margin: '1vh 0px 2vh 0px'
        }
        const textWhenButtonVisible = {
            textAlign: 'left',
            padding: '1vH 1vw 1vH 1vw'
        }
        const textWhenButtonInvisible = {
            textAlign: 'left',
            padding: '2vH 1vw 2vH 1vw'
        }

        const paragraphStyle = this.props.buttonTitle ? textWhenButtonVisible : textWhenButtonInvisible
        return (
            <Paper style={catalogueBoxStyle} border={1}>
                {this.props.title ? <h3>{this.props.title}</h3> : null}
                {this.props.title ? <Divider /> : null}
                <p style={paragraphStyle}>{this.props.children}</p>
                {this.props.buttonTitle ? <Button style={browseButtonStyle} variant="contained" href={this.props.buttonLink}>{this.props.buttonTitle}</Button> : null}
            </Paper>
        );
    }
}

export default ECHPaper;