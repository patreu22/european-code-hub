import React, { Component, } from 'react';
import { Box } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ECHButton from './ECHButton';
import { sleep } from '../helper/sleepHelper'
import { withTheme } from '@material-ui/styles';

class ECHCopyBox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isCopied: false,
            maxBoxWidth: 0,
            copyBoxStyle: null
        }

        this.copySelectorButton = React.createRef();
        this._onCopyHandler = this._onCopyHandler.bind(this)
    }

    componentDidUpdate() {
        const box = this.copySelectorButton.current
        if (box !== null && typeof box !== "undefined") {
            const rect = box.getBoundingClientRect();
            const maxBoxWidth = rect.width
            if (maxBoxWidth > this.state.maxBoxWidth) {
                this.setState({ maxBoxWidth })
            }
        }
    }

    render() {
        const copyBoxStyle = {
            backgroundColor: this.props.theme.palette.grey[200],
            padding: '3px 7px 3px 7px',
            marginTop: '10px',
            fontWeight: 'bold'
        }

        const copyBoxStyleHover = {
            ...copyBoxStyle,
            backgroundColor: this.props.theme.palette.secondary.main,
            cursor: 'pointer'
        }

        const copyText = `git clone ${this.props.repoUrl}`
        const buttonContent = this.state.isCopied
            ? <CheckIcon />
            : "Copy"

        return (
            <div>
                <CopyToClipboard text={copyText} onCopy={() => this._onCopyHandler(copyBoxStyle)} style={this.state.copyBoxStyle ?? copyBoxStyle} onMouseEnter={() => this.setState({ copyBoxStyle: copyBoxStyleHover })} onMouseLeave={() => this.setState({ copyBoxStyle: copyBoxStyle })}>
                    <div style={{ display: 'inline-block' }}>
                        <Box style={{ display: 'inline', marginRight: '15px', height: '100vH' }}>{copyText}</Box>
                        <div ref={this.copySelectorButton} style={{ display: 'inline-block' }}>
                            <ECHButton width={this.state.maxBoxWidth}>{buttonContent}</ECHButton>
                        </div>
                    </div>
                </CopyToClipboard>
            </div>
        );
    }

    _onCopyHandler(copyBoxStyle) {
        this.setState({
            isCopied: true,
            copyBoxStyle: copyBoxStyle
        }, () => sleep(2000).then(() => this.setState({ isCopied: false })))
    }
}

export default withTheme(ECHCopyBox);