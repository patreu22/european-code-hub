import React, { Component, } from 'react';
import { Box } from '@material-ui/core'
import ECHMultipleSelect from './ECHMultipleSelect'

class ECHFilterBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            languageFilter: [],
            licenseFilter: []
        }

        this._onLanguageFilterChanged = this._onLanguageFilterChanged.bind(this)
        this._onLicenseFilterChanged = this._onLicenseFilterChanged.bind(this)
    }

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
            <Box style={filterBarStyling}>{this._renderProgrammingLanguageFilter()}</Box>
        );
    }

    _renderProgrammingLanguageFilter() {
        const filterStyle = {
            display: 'inline-block'
        }

        return <div style={filterStyle}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <ECHMultipleSelect
                    title="Programming language"
                    multiple={true}
                    options={["Released", "Development", "Deprecated"]}
                    value={this.state.languageFilter}
                    onChange={this._onLanguageFilterChanged}
                    style={{ paddingRight: '50px' }}
                />
                <ECHMultipleSelect
                    title="License"
                    multiple={true}
                    options={["Creative Commons Zero v1.0 Universal", "BSD-3-Clause", "NOASSERTION"]}
                    value={this.state.licenseFilter}
                    onChange={this._onLicenseFilterChanged}
                />
            </div>
        </div >
    }

    _onLanguageFilterChanged(event) {
        this.setState({
            languageFilter: event.target.value
        })
    }

    _onLicenseFilterChanged(event) {
        this.setState({
            licenseFilter: event.target.value
        })
    }
}

export default ECHFilterBar;