import React, { Component, } from 'react';
import { Tooltip } from '@material-ui/core'

class ECHIconAndText extends Component {
    //{ icon, text, tooltipText, link }
    render() {
        const textLineStyle = {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            textAlign: 'left',
            paddingBottom: '3px'
        }
        const iconStyle = {
            paddingRight: '5px'
        }

        const textElement = this.props.link
            ? <a href={this.props.link}>{this.props.text}</a>
            : <span>{this.props.text}</span>

        if (typeof this.props.text === 'undefined') { return null }

        if (this.props.tooltipText) {
            return <div style={textLineStyle}>
                <span style={iconStyle}>
                    <Tooltip title={this.props.tooltipText}>
                        {this.props.icon}
                    </Tooltip>
                </span> {textElement}
            </div>
        } else {
            return <div style={textLineStyle}>
                <span style={iconStyle}>
                    {this.props.icon}
                </span> {textElement}
            </div>
        }
    }
}

export default ECHIconAndText;