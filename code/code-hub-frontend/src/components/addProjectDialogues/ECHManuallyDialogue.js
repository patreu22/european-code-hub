import React, { Component, } from 'react';

import ECHPaper from '../ECHPaper'
import ECHBackButton from './ECHBackButton'


class ECHManuallyDialogue extends Component {

    render() {
        const title = this._projectDataExists() ? "Check data" : "Enter data"
        return <div>
            <ECHPaper type="addProjectManually" title={title}></ECHPaper>
            <ECHBackButton />
        </div>
    }

    _projectDataExists() {
        const projectData = this.props.projectData
        if (projectData) {
            return Object.entries(projectData).length > 0 && projectData.constructor === Object
        } else {
            return false
        }
    }
}

export default ECHManuallyDialogue;
