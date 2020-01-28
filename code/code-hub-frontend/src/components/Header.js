import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Menu, MenuItem, Typography, IconButton, Tooltip } from '@material-ui/core/';
import {
    List as ListIcon,
    Add as AddIcon,
    Build as BuildIcon,
    DeleteForever as DeleteIcon,
    Search as SearchIcon,
    Home as HomeIcon,
    AccountCircle
} from '@material-ui/icons/';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { getVerificationToken, removeVerificationToken } from '../helper/cookieHelper'

import EuropeanLogo from '../assets/europe_logo.png';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    headerToolbar: {
        minHeight: '5vh',
        color: 'black',
        backgroundColor: 'white'
    },
    headerLink: {
        textColor: 'black'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'block'
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
}));


function Header(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);

    // const handleProfileMenuOpen = event => {
    //     setAnchorEl(event.currentTarget);
    // };

    const handleLoginClick = event => {
        const token = getVerificationToken();
        if (typeof token === 'undefined' || token === '') {
            props.history.push(`/login`);
        } else {
            props.history.push(`/user`);
        }

    };


    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const _getMenuEntry = (menuEntry, index) => {
        const linkIcon = menuEntry.link
            ? <Link to={menuEntry.link}>{menuEntry.icon}</Link>
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            : <a>{menuEntry.icon}</a>
        return <Tooltip title={menuEntry.tooltipText} key={index}>
            <IconButton className={classes.headerLink} onClick={menuEntry.onClickHandler} edge="end">
                {linkIcon}
            </IconButton>
        </Tooltip>
    }

    const headerMenu = [
        {
            icon: <HomeIcon />,
            link: "/",
            tooltipText: "Home page"
        },
        {
            icon: <SearchIcon />,
            link: "/search",
            tooltipText: "Search project(s)"
        },
        {
            icon: <ListIcon />,
            link: "/projects",
            tooltipText: "Browse projects"
        },
        {
            icon: <AddIcon />,
            link: "/add",
            tooltipText: "Add new project"
        },
        {
            icon: <BuildIcon />,
            link: "/contribute",
            tooltipText: "Support this project"
        },
        {
            icon: <DeleteIcon />,
            onClickHandler: removeVerificationToken,
            tooltipText: "Remove verification cookie"
        },
        {
            icon: <AccountCircle />,
            onClickHandler: handleLoginClick,
            tooltipText: "Login / Go",
            edge: "end"
        },
    ]

    const menuEntries = headerMenu.map((entry, index) => _getMenuEntry(entry, index))

    return (
        < div className={classes.header} >
            <AppBar position="static">
                <Toolbar className={classes.headerToolbar}>
                    <Link className={classes.headerLink} to="/">
                        <img width={45} height={45} src={EuropeanLogo} alt="logo" />
                    </Link>
                    <Link className={classes.headerLink} to="/">
                        <Typography className={classes.title} variant="h6" noWrap>
                            European Code Hub
                        </Typography>
                    </Link>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {menuEntries}
                    </div>
                    {/* <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-haspopup="true"
                            color="inherit"
                        >
                        </IconButton>
                    </div> */}
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div >
    );
}

export default withRouter(Header);