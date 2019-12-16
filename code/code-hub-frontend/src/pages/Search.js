import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import { withRouter } from "react-router";

class Search extends Component {

    render() {
        console.log(this.props)
        const searchTerm = this.props.match.params.searchterm;
        return (
            <PageWrapper>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <h1> Search term: {searchTerm} </h1>
                </div>
            </PageWrapper>
        );
    }
}

export default withRouter(Search);