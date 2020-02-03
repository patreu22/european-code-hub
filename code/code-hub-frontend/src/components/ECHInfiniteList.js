import React, { Component, } from 'react';
import { List } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller';
import ECHLoadingIndicator from './ECHLoadingIndicator'
import ProjectListItem from './ProjectListItem';

class ECHInfiniteList extends Component {
    render() {
        const infiniteScrollStyle = {
            paddingBottom: '50px'
        }

        return <InfiniteScroll
            pageStart={0}
            loadMore={this.props.loadMore}
            hasMore={this.props.hasMore}
            style={infiniteScrollStyle}
            loader={<div style={{ paddingTop: '10px', paddingBottom: '10px', textAlign: 'center' }} className="loader" key={0}><ECHLoadingIndicator /></div>}
        >
            {this.renderProjectList()}
        </InfiniteScroll>
    }

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
            return <div>No data!</div>
        } else {
            return <List style={flexContainer}>
                {projects}
            </List>
        }
    }
}

export default ECHInfiniteList;