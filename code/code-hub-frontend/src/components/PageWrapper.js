import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@material-ui/core';

class App extends React.Component {
    render() {
        const contentStyle = {
            minHeight: '90vH',
            paddingTop: '5vH',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };

        return (
            <span>
                <Header />
                <div style={contentStyle}>
                    {this._renderDefaultTitle()}
                    {this.props.children}
                </div>
                <Footer />
            </span >
        );
    }

    _renderDefaultTitle() {
        const headlineStyling = {
            margin: 0,
            paddingTop: '20px',
            color: 'white'
        }

        const heroStyling = {
            backgroundColor: '#004494',
            width: '100vw',
            textAlign: 'center',
            padding: '3vh 0 3vh 0'
        }

        const moreContent = this.props.headerContent ? this.props.headerContent : null
        return this.props.headlineTitle
            ? <Box style={heroStyling}>
                <h1 style={headlineStyling}>{this.props.headlineTitle}</h1>
                {moreContent}
            </Box>
            : null
    }
}

export default App;

// European color Blue: #004494
// Yellow: #ffd617