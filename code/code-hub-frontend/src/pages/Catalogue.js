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
        this.state = {
            initialLoadingDone: false
        }
        this.loadFunc = this.loadFunc.bind(this)
    }

    componentWillUnmount() {
        // this.props.resetToDefaultState()
    }

    render() {
        if (this.props.isLoading) {
            return < PageWrapper headlineTitle="Complete project catalogue" showBackButton={true}>
                <ECHLoadingIndicator />
            </PageWrapper>
        } else {
            return (
                < PageWrapper headlineTitle="Complete project catalogue" showBackButton={true}>
                    <ECHFilterBar />
                    <ECHInfiniteList
                        projects={this.props.projects}
                        hasMore={this.props.moreChunkToLoad}
                        loadMore={this.loadFunc}
                    />
                </PageWrapper >
            );
        }
    }

    //TODO: Loading Hänger!
    loadFunc = (page) => {
        if (!this.state.initialLoadingDone) {
            this.props.getFilteredProjects(this.props.currentFilters, page, true, false)
            this.setState({ initialLoadingDone: true })
        } else {
            this.props.getFilteredProjects(this.props.currentFilters, page, true, true)
        }
    }

}

const mapStateToProps = state => {
    return {
        projects: state.projectOverview.projects,
        initialLoading: state.projectOverview.initialLoading,
        moreChunkToLoad: state.projectOverview.moreChunkToLoad,
    }
}

const mapDispatchToProps = { getFilteredProjects, resetToDefaultState }

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);