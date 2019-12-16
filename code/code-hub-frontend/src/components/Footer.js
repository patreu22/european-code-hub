import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core/';
import tub_logo from '../assets/tub_logo.svg';


const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        textAlign: 'center',
        backgroundColor: 'white',
        flex: 'none',
        minHeight: '7vH'
    },
    footerNote: {
        fontSize: 11
    },
    footerLogo: {
        position: 'fixed',
        bottom: 10,
        right: 10
    }
}));

export default function Footer() {
    const classes = useStyles();

    return (
        <Box boxShadow={4} className={classes.footer}>
            <span className={classes.footerNote}>EU ♡ FLOSS</span>
            <img className={classes.footerLogo} height="27" width="37" src={tub_logo} alt="logo" />
        </Box >
    );
}