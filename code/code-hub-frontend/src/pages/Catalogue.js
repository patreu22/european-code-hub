import '../css/Home.css';
import React, { Component } from 'react';
import PageWrapper from '../components/PageWrapper';
import { List } from '@material-ui/core';
import ProjectListItem from '../components/ProjectListItem';
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import InfiniteScroll from 'react-infinite-scroller';
import { getProjectChunk } from '../helper/httpHelper'
// import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'

import { connect } from 'react-redux'
import { getAllProjects } from '../actions/httpActions'

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Catalogue extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            page: 0,
            hasMore: true
        }

        this.loadFunc = this.loadFunc.bind(this)
    }

    // componentDidMount() {
    //     // getProjectChunk(4).then((response) => console.log(response))
    // }

    render() {
        // const filterFields = [
        //     { name: 'name', label: 'Name' },
        //     { name: 'email', label: 'Email' },
        //     { name: 'registered', label: 'Registered', type: 'date' },
        //     { name: 'isActive', label: 'Is Active', type: 'bool' },
        // ];

        var contentBox = this.props.isLoading
            ? <ECHLoadingIndicator />
            : this.renderProjectList()

        return (
            < PageWrapper headlineTitle="Complete project catalogue">
                {/* <FilterDrawer
                        name={'demo'}
                        fields={filterFields}
                        locale={'de-DE'}
                        DateTimeFormat={global.Intl.DateTimeFormat}
                        okLabel="OK"
                        cancelLabel="Abbrechen"
                    /> */}
                {/* <SearchHero type="catalogue" /> */}
                {contentBox}
                <InfiniteScroll
                    pageStart={2}
                    loadMore={this.loadFunc}
                    hasMore={this.state.hasMore}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                >
                    {this.state.items}
                </InfiniteScroll>
            </PageWrapper >
        );
    }

    loadFunc() {
        console.log("Load more!")
        const itemsPerLoad = 3
        const itemsToSkip = this.state.page * itemsPerLoad
        console.log(`Items to skip: ${itemsToSkip} | Items per Load: ${itemsPerLoad}`)
        getProjectChunk(itemsToSkip, itemsPerLoad).then((response) => {
            const items = response.projects
            if (items.length === 0) {
                console.log("Nothing more to load")
                this.setState({
                    hasMore: false
                })
            } else {
                console.log("More to load!")
                this.setState({
                    hasMore: true
                })
            }
            const transformedItems = items.map((projectData) => <ProjectListItem project={projectData}></ProjectListItem>)
            const updatedItems = this.state.items.concat(transformedItems).map((item, index) => React.cloneElement(item, { key: index, index: index }))
            console.log(updatedItems)
            this.setState({
                items: updatedItems,
                page: this.state.page + 1
            })
        })
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
        isLoading: state.projectOverview.isLoading
    }
}

const mapDispatchToProps = { getAllProjects }

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);