import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core/';
import tub_logo from '../assets/tub_logo.svg';
import Modal from './Modal'


const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        flex: 3,
        alignItems: "center",
        textAlign: 'center',
        backgroundColor: 'white',
        minHeight: '5vH'
    },
    footerNote: {
        fontSize: 11,
        flex: 1
    },
    footerLogo: {
        width: "37px",
        height: "27px",
        cursor: 'pointer',
        padding: "5px 8px 5px 0px"
    },
    logoWrapper: {
        flex: 1,
        textAlign: 'right',
    },
    columnPlaceholder: {
        flex: 1
    }
}));

export default function Footer() {
    const classes = useStyles();
    const [openInfoModal, setOpenInfoModal] = React.useState(false);
    return (
        <Box boxShadow={4} className={classes.footer}>
            <div className={classes.columnPlaceholder} />
            <div className={classes.footerNote}>EU ♡ FLOSS</div>
            <div className={classes.logoWrapper}>
                <img className={classes.footerLogo} height="27" width="37" src={tub_logo} alt="logo" onClick={() => _handleTuLogoClick(setOpenInfoModal)} />
                <Modal open={openInfoModal} handleClose={() => _handleModalClose(setOpenInfoModal)} />
            </div>
        </Box >
    );
}

function _handleModalClose(setOpenInfoModal) {
    console.log("Close")
    setOpenInfoModal(false)
}

function _handleTuLogoClick(setOpenInfoModal) {
    setOpenInfoModal(true)
}