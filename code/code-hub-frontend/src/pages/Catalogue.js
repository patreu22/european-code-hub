import '../css/Home.css';
import React, { Component } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHInfiniteList from '../components/ECHInfiniteList';
import ECHFilterBar from '../components/ECHFilterBar'

import { connect } from 'react-redux'
import { getFilteredProjects } from '../actions/httpActions'
import { resetToDefaultState } from '../slices/projectOverviewSlice'

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Catalogue extends Component {

    constructor(props) {
        super(props)
        this.loadFunc = this.loadFunc.bind(this)
    }

    render() {
        return < PageWrapper headlineTitle="Complete project catalogue" showBackButton={true}>
            <ECHFilterBar />
            {this.props.totalResultsLength >= 0 && <div style={{ width: "80%", textAlign: 'left' }}>Total results: {this.props.totalResultsLength}</div>}
            <ECHInfiniteList
                projects={this.props.projects}
                hasMore={this.props.moreChunkToLoad}
                loadMore={this.loadFunc}
                type="catalogue"
            />
        </PageWrapper >
    }

    loadFunc = (page) => this.props.getFilteredProjects(this.props.currentFilters, page, true, this.props.sortBy)

}

const mapStateToProps = state => {
    return {
        projects: state.projectOverview.projects,
        moreChunkToLoad: state.projectOverview.moreChunkToLoad,
        currentFilters: state.projectOverview.currentFilters,
        totalResultsLength: state.projectOverview.totalResultsLength,
        sortBy: state.projectOverview.sortBy,
    }
}

const mapDispatchToProps = { getFilteredProjects, resetToDefaultState }

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);