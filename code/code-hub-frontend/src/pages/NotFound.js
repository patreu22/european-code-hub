import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper'
import NotFoundIllustration from '../assets/page_not_found.svg';
import ECHButton from '../components/ECHButton'
import { HOME } from '../routes'

class NotFound extends Component {

    illustration = <img src={NotFoundIllustration} alt="logo" style={{
        height: '100%',
        width: '100%'
    }} />

    render() {
        return (
            <PageWrapper headlineTitle="Error 404: Page not found" showBackButton={true}>
                <div style={{ height: '60vh', marginTop: '30px', marginBottom: '20px' }} >
                    {this.illustration}
                </div>
                <ECHButton buttonLink={HOME}>Go back to home page</ECHButton>
            </PageWrapper>
        );
    }
}

export default NotFound;