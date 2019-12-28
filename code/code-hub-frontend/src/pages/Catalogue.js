import '../css/Home.css';
import React, { Component } from 'react';
import PageWrapper from '../components/PageWrapper';
import { Box, CircularProgress, List } from '@material-ui/core';
import { getAllProjects } from '../helper/httpHelper';
import ProjectListItem from '../components/ProjectListItem';
import SearchHero from '../components/SearchHero';
// import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Catalogue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            isLoading: false
        };
        this.getAllProjects = getAllProjects.bind(this)
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        })
        const contextThis = this;
        this.getAllProjects()
            .then(function (data) {
                contextThis.setState({
                    projects: data.projects,
                    isLoading: false
                })
            })
            .catch(function (error) {
                console.log(error)
                contextThis.setState({
                    isLoading: false
                })
            });
    }

    render() {
        // const filterFields = [
        //     { name: 'name', label: 'Name' },
        //     { name: 'email', label: 'Email' },
        //     { name: 'registered', label: 'Registered', type: 'date' },
        //     { name: 'isActive', label: 'Is Active', type: 'bool' },
        // ];

        var contentBox = this.state.isLoading ? <CircularProgress className="center" color="secondary" /> : this.renderProjectList()
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


    renderProjectList() {
        const flexContainer = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 0,
            width: '85vw',
            marginTop: '1vh',
            justifyContent: 'flex-start'
        };

        const projects = this.state.projects.map((project, index) => (
            <ProjectListItem project={project} index={index} key={index}></ProjectListItem>
        ))
        return <List style={flexContainer}>
            {projects}
        </List>
    }
}

export default Catalogue;