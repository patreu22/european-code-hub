import '../css/Home.css';
import React, { Component } from 'react';
import PageWrapper from '../components/PageWrapper';
import { Box, CircularProgress, List } from '@material-ui/core';
import { getAllProjects } from '../helper/httpHelper';
import ProjectListItem from '../components/ProjectListItem'
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
        const headlineStyling = {
            margin: 0,
            padding: 10,
            paddingTop: '20px',
            color: 'white'
        }

        const heroStyling = {
            backgroundColor: '#004494',
            width: '100vw',
            textAlign: 'center'
        }

        // const filterFields = [
        //     { name: 'name', label: 'Name' },
        //     { name: 'email', label: 'Email' },
        //     { name: 'registered', label: 'Registered', type: 'date' },
        //     { name: 'isActive', label: 'Is Active', type: 'bool' },
        // ];

        if (this.state.isLoading) {
            return <PageWrapper><CircularProgress className="center" color="secondary" /></PageWrapper>
        } else {
            return (
                < PageWrapper >
                    <Box style={heroStyling}>
                        <h1 style={headlineStyling}>Full project catalogue</h1>
                    </Box>
                    {/* <FilterDrawer
                        name={'demo'}
                        fields={filterFields}
                        locale={'de-DE'}
                        DateTimeFormat={global.Intl.DateTimeFormat}
                        okLabel="OK"
                        cancelLabel="Abbrechen"
                    /> */}
                    {this.renderProjectList()}
                </PageWrapper >
            );
        }
    }


    renderProjectList() {
        return <List>
            {this.state.projects.map((project, index) => (
                <ProjectListItem project={project} index={index}></ProjectListItem>
            ))}
        </List>
    }
}

export default Catalogue;