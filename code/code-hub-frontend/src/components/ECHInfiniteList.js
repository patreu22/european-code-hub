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

        //Type: search || catalogue
        return <InfiniteScroll
            pageStart={1}
            loadMore={this.props.loadMore}
            type={this.props.type}
            hasMore={this.props.hasMore}
            style={infiniteScrollStyle}
            initialLoad={true}
            loader={this.getLoader()}
        >
            {this.renderProjectList()}
        </InfiniteScroll>
    }

    illustration = <img src={NoDataIllustration} alt="No data" style={{
        height: '100%',
        width: '100%'
    }} />

    getLoader() {
        if (this.props.type === "search" && this.props.projects.length === 0) {
            return <div key={0} />
        } else {
            return <div style={{ paddingTop: '10px', paddingBottom: '10px', textAlign: 'center' }} className="loader" key={0}>
                <ECHLoadingIndicator />
            </div>
        }
    }

    getIllustration() {
        if (this.props.type === "catalogue") {
            return <div />
        } else if (this.props.type === "search") {
            console.log("Has more? " + this.props.hasMore)
            const text = this.props.hasMore || typeof this.props.hasMore
                ? "Start your search to find amazing projects."
                : "No results found: Alter your search to find amazing projects."

            return <div>
                <div style={{ height: '40vh', marginTop: '30px', marginBottom: '7vh' }} >
                    {this.illustration}
                </div>
                <div style={{ textAlign: 'center' }}>{text}</div>
            </div >
        }
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