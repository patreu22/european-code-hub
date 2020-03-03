import React, { Component, } from 'react';
import { Box } from '@material-ui/core'
import ECHMultipleSelect from './ECHMultipleSelect'
import ECHIconButton from './ECHIconButton'
import { connect } from 'react-redux'
import { getFilteredProjects } from '../actions/httpActions'
import { addFilter, removeFilter, resetFilters, setSortBy } from '../slices/projectOverviewSlice'
import { DeleteSweep as DeleteSweepIcon } from '@material-ui/icons/';

class ECHFilterBar extends Component {

    constructor(props) {
        super(props)
        this._onSortByChanged = this._onSortByChanged.bind(this)
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
            padding: '5px 0 5px 0',
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

        //TODO: Save options on server
        return <div style={filterStyle}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <ECHMultipleSelect
                    title="Project status"
                    displayResetOption={true}
                    multiple={true}
                    options={["Archival", "Released", "Development", "Deprecated"]}
                    value={this.props.currentFilters.status}
                    onChange={(event) => this._onFilterChanged(event, "status", this.props.currentFilters.status)}
                    style={{ paddingRight: '50px' }}
                />
                <ECHMultipleSelect
                    title="License"
                    displayResetOption={true}
                    multiple={true}
                    options={["Creative Commons Zero v1.0 Universal", "BSD-3-Clause", "NOASSERTION"]}
                    value={this.props.currentFilters.license}
                    onChange={(event) => this._onFilterChanged(event, "license", this.props.currentFilters.license)}
                    style={{ paddingRight: '50px' }}
                />
                <ECHMultipleSelect
                    title="Organization"
                    displayResetOption={true}
                    multiple={true}
                    options={["Internal Revenue Service(IRS)", "Bureau of the Fiscal Service(BFS)", "18F"]}
                    value={this.props.currentFilters.organization}
                    onChange={(event) => this._onFilterChanged(event, "organization", this.props.currentFilters.organization)}
                    style={{ paddingRight: '50px' }}
                />
                <ECHMultipleSelect
                    title="Programming languages"
                    displayResetOption={true}
                    multiple={true}
                    options={["Python", "Javascript"]}
                    value={this.props.currentFilters.programmingLanguages}
                    onChange={(event) => this._onFilterChanged(event, "programmingLanguages", this.props.currentFilters.programmingLanguages)}
                    style={{ paddingRight: '50px' }}
                />
                <ECHMultipleSelect
                    title="Sort by"
                    multiple={false}
                    width={"120px"}
                    options={["projectName", "organization"]}
                    sortField={true}
                    value={this.props.sortBy}
                    onChange={this._onSortByChanged}
                    style={{ paddingRight: '50px' }}
                />
                <ECHIconButton tooltipText="Reset all filters" icon={<DeleteSweepIcon />} onClick={() => { this.props.resetFilters() }} />
            </div>
        </div >
    }

    _onSortByChanged(event) {
        const sortBy = event.target.value
        this.props.setSortBy({ sortBy })
    }

    _onFilterChanged(event, filterKey, filterProp) {
        const filterValue = event.target.value
        if (filterValue.includes("Reset filter") || filterValue === filterProp || filterValue.length === 0) {
            this.props.removeFilter({ filterKey })
        } else {
            this.props.addFilter({
                filter: {
                    filterKey,
                    filterValue: event.target.value
                }
            })
        }
    }
}

const mapStateToProps = state => {
    return {
        projects: state.projectOverview.projects,
        currentFilters: state.projectOverview.currentFilters,
        sortBy: state.projectOverview.sortBy
    }
}

const mapDispatchToProps = { getFilteredProjects, addFilter, removeFilter, resetFilters, setSortBy }

export default connect(mapStateToProps, mapDispatchToProps)(ECHFilterBar);