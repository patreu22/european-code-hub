import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core/';


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
    }
}));

export default function Footer() {
    const classes = useStyles();

    return (
        <Box boxShadow={4} className={classes.footer}>
            <span className={classes.footerNote}>EU ♡ FLOSS</span>
        </Box >
    );
}