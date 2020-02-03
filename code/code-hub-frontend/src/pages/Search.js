import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHSearchHero from '../components/ECHSearchHero';
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import ECHInfiniteList from '../components/ECHInfiniteList';
import { connect } from 'react-redux'
import { getSearchResults } from '../actions/httpActions'

class Search extends Component {

    constructor(props) {
        super(props)
        this._renderContent = this._renderContent.bind(this)
        this.loadFunc = this.loadFunc.bind(this)
    }

    componentDidMount() {
        const searchTerm = this.props.match.params.searchterm;
        if (searchTerm) {
            this.props.getSearchResults(searchTerm, 1, false)
        }
    }

    componentDidUpdate(prevProps) {
        const previousSearchTerm = prevProps.match.params.searchterm;
        const currentSearchTerm = this.props.match.params.searchterm;
        if (previousSearchTerm !== currentSearchTerm) {
            this.props.getSearchResults(currentSearchTerm, 1, false)
        }
    }

    render() {
        const searchTerm = this.props.match.params.searchterm;
        const content = this.props.isLoading
            ? <ECHLoadingIndicator />
            : this._renderContent(searchTerm)
        return (
            <PageWrapper headlineTitle="Search">
                <ECHSearchHero type="catalogue" initialValue={searchTerm || ''} />
                {content}
            </PageWrapper>
        );
    }

    _renderContent = (searchTerm) => {
        return <ECHInfiniteList
            projects={this.props.projects}
            hasMore={this.props.moreChunkToLoad}
            loadMore={(page) => this.loadFunc(page, searchTerm)}
        />
    }

    loadFunc = (page, searchTerm) => this.props.getSearchResults(searchTerm, page, true)
}

const mapStateToProps = state => {
    return {
        projects: state.search.projects,
        isLoading: state.search.isLoading
    }
}

const mapDispatchToProps = { getSearchResults }

export default connect(mapStateToProps, mapDispatchToProps)(Search);