import React, { Component, } from 'react';
import { Box } from '@material-ui/core'
import ECHMultipleSelect from './ECHMultipleSelect'
import { connect } from 'react-redux'
import { getFilteredProjects } from '../actions/httpActions'
import { addFilter, removeFilter } from '../slices/projectOverviewSlice'

class ECHFilterBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            languageFilter: [],
            licenseFilter: []
        }

        this._onStatusFilterChanged = this._onStatusFilterChanged.bind(this)
        this._onLicenseFilterChanged = this._onLicenseFilterChanged.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentFilters !== this.props.currentFilters) {
            this.props.getFilteredProjects(this.props.currentFilters, 1, false)
        }
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
                    title="Status"
                    multiple={true}
                    options={["Archival", "Released", "Development", "Deprecated"]}
                    value={this.props.currentFilters.status}
                    onChange={this._onStatusFilterChanged}
                    style={{ paddingRight: '50px' }}
                />
                <ECHMultipleSelect
                    title="License"
                    multiple={true}
                    options={["Creative Commons Zero v1.0 Universal", "BSD-3-Clause", "NOASSERTION"]}
                    value={this.props.currentFilters.license}
                    onChange={this._onLicenseFilterChanged}
                />
            </div>
        </div >
    }

    _onStatusFilterChanged(event) {
        if (event.target.value === this.props.currentFilters.status) {
            this.props.removeFilter({
                filterKey: "status"
            })
        } else {
            this.props.addFilter({
                filter: {
                    filterKey: "status",
                    filterValue: event.target.value
                }
            })
        }
    }

    _onLicenseFilterChanged(event) {
        this.props.addFilter({
            filter: {
                filterKey: "license",
                filterValue: event.target.value
            }
        })
    }
}

const mapStateToProps = state => {
    return {
        projects: state.projectOverview.projects,
        currentFilters: state.projectOverview.currentFilters,
    }
}

const mapDispatchToProps = { getFilteredProjects, addFilter, removeFilter }

export default connect(mapStateToProps, mapDispatchToProps)(ECHFilterBar);