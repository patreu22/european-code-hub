import '../css/Home.css';
import React, { Component } from 'react';
import PageWrapper from '../components/PageWrapper';
import { List } from '@material-ui/core';
import ProjectListItem from '../components/ProjectListItem';
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'

import InfiniteScroll from 'react-infinite-scroller';

import ECHFilterBar from '../components/ECHFilterBar'

import { connect } from 'react-redux'
import { getAllProjects, getFilteredProjects, getProjectChunk } from '../actions/httpActions'

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Catalogue extends Component {

    constructor(props) {
        super(props)
        this.loadFunc = this.loadFunc.bind(this)
    }

    render() {
        var contentBox = this.props.isLoading
            ? <ECHLoadingIndicator />
            : this._renderInfiniteScroll()

        return (
            < PageWrapper headlineTitle="Complete project catalogue" showFilterBar={true}>
                <ECHFilterBar />
                {/* <SearchHero type="catalogue" /> */}
                {contentBox}
            </PageWrapper >
        );
    }

    _renderInfiniteScroll() {
        return <InfiniteScroll
            pageStart={0}
            loadMore={this.loadFunc}
            hasMore={this.props.moreChunkToLoad}
            loader={<div style={{ paddingTop: '10px', paddingBottom: '10px', textAlign: 'center' }} className="loader" key={0}><ECHLoadingIndicator /></div>}
        >
            {this.renderProjectList()}
        </InfiniteScroll>
    }

    loadFunc = (page) => this.props.getProjectChunk(page)

    renderProjectList = () => {
        const flexContainer = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 0,
            width: '85vw',
            marginTop: '1vh',
            justifyContent: 'flex-start'
        };

        const projects = this.props.projects.map((project, index) => (
            <ProjectListItem project={project} index={index} key={index}></ProjectListItem>
        ))

        //TODO: No data placeholder
        if (this.props.projects.length === 0) {
            return <div></div>
        } else {
            return <List style={flexContainer}>
                {projects}
            </List>
        }
    }
}

const mapStateToProps = state => {
    return {
        projects: state.projectOverview.projects,
        isLoading: state.projectOverview.isLoading,
        moreChunkToLoad: state.projectOverview.moreChunkToLoad,
    }
}

const mapDispatchToProps = { getAllProjects, getFilteredProjects, getProjectChunk }

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);