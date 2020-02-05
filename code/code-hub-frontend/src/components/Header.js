import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, AppBar, Toolbar, Menu, MenuItem, Typography, IconButton, Tooltip } from '@material-ui/core/';
import {
    List as ListIcon,
    Add as AddIcon,
    Build as BuildIcon,
    Search as SearchIcon,
    Home as HomeIcon,
    Person as PersonIcon
} from '@material-ui/icons/';
import EuropeanLogo from '../assets/europe_logo.png';
import { Link, useHistory } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import { USER, LOGIN, CONTRIBUTE } from '../routes'
import { logoutUser } from '../actions/cookieActions'

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

    const history = useHistory();

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const profileImagePicture = "data:image/png;base64," + btoa(new Uint8Array(props.profilePicture).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
    }, ''));

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onProfileLinkClicked = () => {
        handleMenuClose();
        history.push(USER);
    }

    const onLogoutClicked = () => {
        handleMenuClose();
        props.logoutUser()
    }

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
            <MenuItem onClick={onProfileLinkClicked}>Profile</MenuItem>
            <MenuItem onClick={onLogoutClicked}>Logout</MenuItem>
        </Menu>
    );

    const _getMenuEntry = (menuEntry, index) => {
        const linkIcon = menuEntry.link
            ? <Link to={menuEntry.link}>{menuEntry.icon}</Link>
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            : <a>{menuEntry.icon}</a>

        const button = <IconButton className={classes.headerLink} onClick={menuEntry.onClickHandler} edge="end" key={index}>
            {linkIcon}
        </IconButton>

        if (menuEntry.tooltipText) {
            return <Tooltip title={menuEntry.tooltipText} key={index}>
                {button}
            </Tooltip>
        } else { return button }
    }

    const lastMenuEntry = props.verificationCookie
        ? {
            icon: <Avatar src={profileImagePicture} alt="Profile Image" />,
            onClickHandler: handleProfileMenuOpen,
            edge: "end"
        }
        : {
            icon: <PersonIcon />,
            link: LOGIN,
            tooltipText: "Login",
            edge: "end"
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
            link: CONTRIBUTE,
            tooltipText: "Support this project"
        },
        lastMenuEntry
    ]

    const menuEntries = headerMenu.map((entry, index) => _getMenuEntry(entry, index))

    return <div className={classes.header}>
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
            </Toolbar>
        </AppBar>
        {renderMenu}
    </div >
}

const mapStateToProps = state => {
    return {
        verificationCookie: state.user.cookie,
        profilePicture: state.user.profilePicture
    }
}

const mapDispatchToProps = { logoutUser }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
