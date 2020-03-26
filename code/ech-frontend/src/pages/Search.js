import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHSearchHero from '../components/ECHSearchHero';
import ECHInfiniteList from '../components/ECHInfiniteList';
import { connect } from 'react-redux'
import { getSearchResults } from '../actions/httpActions'
import { resetToDefaultState } from '../slices/searchSlice'
import qs from 'qs';

class Search extends Component {

    constructor(props) {
        super(props)
        this.loadFunc = this.loadFunc.bind(this)
        this.getSearchTerm = this.getSearchTerm.bind(this)
    }

    componentWillUnmount() {
        this.props.resetToDefaultState()
    }

    componentDidUpdate(prevProps) {
        const previousQuery = qs.parse(prevProps.location.search, { ignoreQueryPrefix: true })
        const previousSearchTerm = previousQuery.query
        const currentSearchTerm = this.getSearchTerm()
        if (previousSearchTerm !== currentSearchTerm) {
            this.props.getSearchResults(currentSearchTerm, 1, false)
        }
    }

    getSearchTerm() {
        const parsedQuery = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
        return parsedQuery.query
    }

    render() {
        const searchTerm = this.getSearchTerm()
        //TODO: Loading indicator
        return <PageWrapper headlineTitle="Search" showBackButton={true} >
            <ECHSearchHero type="catalogue" initialValue={searchTerm || ''} />
            {this.props.totalResultsLength >= 0 && <div style={{ width: "80%", textAlign: 'left' }}>Total results: {this.props.totalResultsLength}</div>}
            <ECHInfiniteList
                projects={this.props.projects}
                hasMore={this.props.moreChunkToLoad}
                loadMore={(page) => this.loadFunc(page, searchTerm)}
                type="search"
            />
        </PageWrapper>
    }

    loadFunc = (page, searchTerm) => {
        if (searchTerm && this.props.moreChunkToLoad) {
            this.props.getSearchResults(searchTerm, page, true)
        }
    }
}

const mapStateToProps = state => {
    return {
        projects: state.search.projects,
        isLoading: state.search.isLoading,
        moreChunkToLoad: state.search.moreChunkToLoad,
        totalResultsLength: state.search.totalResultsLength,
    }
}

const mapDispatchToProps = { getSearchResults, resetToDefaultState }

export default connect(mapStateToProps, mapDispatchToProps)(Search);