import React, { Component, } from 'react';

import ECHPaper from '../ECHPaper'
import ECHBackButton from './ECHBackButton'
import { objectExists } from '../../helper/objectHelper'


class ECHManuallyDialogue extends Component {
    render() {
        const title = objectExists(this.props.projectData) ? "Check data" : "Enter data"
        return <div>
            <ECHPaper type="addProjectManually" title={title}></ECHPaper>
            <ECHBackButton />
        </div>
    }
}

export default ECHManuallyDialogue;
