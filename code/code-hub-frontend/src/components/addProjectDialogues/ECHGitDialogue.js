import React, { Component, } from 'react';

import ECHPaper from '../ECHPaper'
import ECHBackButton from './ECHBackButton'


class ECHGitDialogue extends Component {

    render() {
        return <div>
            <ECHPaper type="addProjectViaGit" title="Enter URL"></ECHPaper>
            <ECHBackButton />
        </div>
    }
}

export default ECHGitDialogue;
