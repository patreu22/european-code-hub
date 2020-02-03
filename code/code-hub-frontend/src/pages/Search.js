import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import { withRouter } from "react-router";
import ECHSearchHero from '../components/ECHSearchHero';

class Search extends Component {

    render() {
        const searchTerm = this.props.match.params.searchterm;
        return (
            <PageWrapper headlineTitle="Search">
                <ECHSearchHero type="catalogue" initialValue={searchTerm || ''} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

                    {searchTerm && <h1> Search term: {searchTerm} </h1>}
                </div>
            </PageWrapper>
        );
    }
}

export default withRouter(Search);