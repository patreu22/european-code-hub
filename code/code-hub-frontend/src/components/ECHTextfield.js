import React, { Component, } from 'react';
import { TextField } from '@material-ui/core'

class ECHTextfield extends Component {
    render() {
        const inputFieldStyle = {
            width: '80%',
            paddingBottom: '1.5vw'
        }
        return <TextField
            style={inputFieldStyle}
            label={this.props.label}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
            value={this.props.value}
            error={this.props.error}
            helperText={this.props.helperText}
            onKeyDown={this.props.onKeyDown}
            multiline={this.props.multiline ?? false}
        />
    }
}

export default ECHTextfield;