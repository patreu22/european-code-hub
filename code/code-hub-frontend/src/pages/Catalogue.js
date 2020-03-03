import '../css/Home.css';
import React, { Component } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
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

    componentWillUnmount() {
        this.props.resetToDefaultState()
    }

    render() {
        return < PageWrapper headlineTitle="Complete project catalogue" showBackButton={true}>
            <ECHFilterBar />
            <ECHInfiniteList
                projects={this.props.projects}
                hasMore={this.props.moreChunkToLoad}
                loadMore={this.loadFunc}
                type="catalogue"
            />
        </PageWrapper >
    }

    loadFunc = (page) => this.props.getFilteredProjects(this.props.currentFilters, page, true)

}

const mapStateToProps = state => {
    return {
        projects: state.projectOverview.projects,
        moreChunkToLoad: state.projectOverview.moreChunkToLoad,
    }
}

const mapDispatchToProps = { getFilteredProjects, resetToDefaultState }

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);