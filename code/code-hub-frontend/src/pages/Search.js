import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import ECHSearchHero from '../components/ECHSearchHero';
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import { connect } from 'react-redux'
import { getSearchResults } from '../actions/httpActions'

class Search extends Component {

    constructor(props) {
        super(props)
        this._renderContent = this._renderContent.bind(this)
    }

    componentDidMount() {
        const searchTerm = this.props.match.params.searchterm;
        if (searchTerm) {
            this.props.getSearchResults(searchTerm, 1, false)
        }
    }

    componentDidUpdate(prevProps) {
        console.log("Update!")
        console.log(this.props)
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
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {searchTerm && <h1> Search term: {searchTerm} </h1>}
        </div>
    }
}

const mapStateToProps = state => {
    return {
        projects: state.search.projects,
        isLoading: state.search.isLoading
    }
}

const mapDispatchToProps = { getSearchResults }

export default connect(mapStateToProps, mapDispatchToProps)(Search);