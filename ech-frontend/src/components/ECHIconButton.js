import React, { Component, } from 'react';
import { Tooltip, IconButton } from '@material-ui/core'
import { Link } from 'react-router-dom'

class ECHIconButton extends Component {
    render() {
        const headerLinkStyle = {
            textColor: 'black'
        }

        const linkIcon = this.props.link
            ? <Link to={this.props.link}>{this.props.icon}</Link>
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            : <a>{this.props.icon}</a>

        const buttonStyle = {
            ...this.props.style,
            ...headerLinkStyle,
        }

        return <Tooltip title={this.props.tooltipText}>
            <IconButton width="1px" height="1px" onClick={this.props.onClick} style={buttonStyle}>
                {linkIcon}
            </IconButton>
        </Tooltip >
    }
}

export default ECHIconButton;