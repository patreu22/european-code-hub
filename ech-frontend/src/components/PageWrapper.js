import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@material-ui/core';
import Sticky from 'react-sticky-el';
import ECHIconButton from '../components/ECHIconButton'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { withLastLocation } from 'react-router-last-location';

class PageWrapper extends React.Component {

    render() {
        const contentStyle = {
            minHeight: '90vH',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };

        return (
            <div>
                <Sticky style={{ zIndex: 1000 }}>
                    <Header />
                </Sticky>
                <div style={contentStyle}>
                    {this._renderHero()}
                    {this.props.children}
                </div>
                <Footer />
            </div>
        );
    }

    _renderBackButton(backLink) {
        const backButtonStyle = {
            position: 'absolute',
            left: '4vh',
            top: "50%",
            transform: "translateY(-50%)",
        }

        return <ECHIconButton
            tooltipText="Go back"
            icon={<ArrowBackIosIcon style={{ color: 'white' }} />}
            link={backLink}
            style={backButtonStyle} />
    }

    _renderHero() {
        const headlineStyling = {
            margin: 0,
            color: 'white'
        }

        const heroStyling = {
            backgroundColor: '#004494',
            width: '100vw',
            textAlign: 'center',
            padding: '3vh 0 3vh 0',
            position: 'relative'
        }

        const moreContent = this.props.headerContent ? this.props.headerContent : null

        const backLink = this.props.lastLocation ? this.props.lastLocation.pathname : ""

        return this.props.headlineTitle
            ? <Box style={heroStyling}>
                {this.props.showBackButton && backLink && this._renderBackButton(backLink)}
                <h1 style={headlineStyling}>{this.props.headlineTitle}</h1>
                {moreContent}
            </Box>
            : null
    }
}

export default withLastLocation(PageWrapper);

// European color Blue: #004494
// Yellow: #ffd617