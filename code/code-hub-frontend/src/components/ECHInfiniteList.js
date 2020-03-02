import React, { Component, } from 'react';
import { List } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller';
import ECHLoadingIndicator from './ECHLoadingIndicator'
import ProjectListItem from './ProjectListItem';
import NoDataIllustration from '../assets/no_data.svg'

class ECHInfiniteList extends Component {
    render() {
        const infiniteScrollStyle = {
            paddingBottom: '50px'
        }

        return <InfiniteScroll
            pageStart={1}
            loadMore={this.props.loadMore}
            hasMore={this.props.hasMore}
            style={infiniteScrollStyle}
            initialLoad={false}
            loader={<div style={{ paddingTop: '10px', paddingBottom: '10px', textAlign: 'center' }} className="loader" key={0}><ECHLoadingIndicator /></div>}
        >
            {this.renderProjectList()}
        </InfiniteScroll>
    }

    componentDidMount() {
        this.props.loadMore(1)
    }

    illustration = <img src={NoDataIllustration} alt="No data" style={{
        height: '100%',
        width: '100%'
    }} />

    getIllustration() {
        const text = this.props.loadMore
            ? "Start your search to find amazing."
            : "Alter your search to find amazing projects."

        return <div>
            <div style={{ height: '40vh', marginTop: '30px', marginBottom: '7vh' }} >
                {this.illustration}
            </div>
            <div style={{ textAlign: 'center' }}>{text}</div>
        </div>
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

        if (this.props.projects.length === 0) {
            return this.getIllustration()
        } else {
            const projects = this.props.projects.map((project, index) => (
                <ProjectListItem project={project} index={index} key={index}></ProjectListItem>
            ))
            return <List style={flexContainer}>
                {projects}
            </List>
        }
    }
}

export default ECHInfiniteList;