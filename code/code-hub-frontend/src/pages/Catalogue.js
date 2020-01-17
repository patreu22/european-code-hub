import '../css/Home.css';
import React, { Component } from 'react';
import PageWrapper from '../components/PageWrapper';
import { CircularProgress, List } from '@material-ui/core';
import ProjectListItem from '../components/ProjectListItem';
// import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'

import { connect } from 'react-redux'
import { getAllProjects } from '../actions/httpActions'

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Catalogue extends Component {

    componentDidMount() {
        this.props.getAllProjects()
    }

    render() {
        // const filterFields = [
        //     { name: 'name', label: 'Name' },
        //     { name: 'email', label: 'Email' },
        //     { name: 'registered', label: 'Registered', type: 'date' },
        //     { name: 'isActive', label: 'Is Active', type: 'bool' },
        // ];

        var contentBox = this.props.isLoading
            ? <CircularProgress className="center" color="secondary" />
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
            </PageWrapper >
        );
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

        return <List style={flexContainer}>
            {projects}
        </List>
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