import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Badge, AppBar, Toolbar, Menu, MenuItem, Typography, IconButton } from '@material-ui/core/';
import { Home as HomeIcon, Mail as MailIcon, Notifications as NotificationsIcon, AccountCircle } from '@material-ui/icons/';
import { Link } from 'react-router-dom';

import EuropeLogo from '../assets/europe_logo.png';


const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
}));

export default function ECHToolbar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
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

    return (
        <div className={classes.grow}>
            <AppBar position="static" color={'white'}>
                <Toolbar>
                    <img width={45} height={45} src={EuropeLogo} alt="logo" />
                    <Typography className={classes.title} variant="h6" noWrap>
                        European Code Hub
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton color="inherit">
                            <Badge color="secondary">
                                <Link to="/">
                                    <HomeIcon />
                                </Link>
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit">
                            <Badge badgeContent={2} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-haspopup="true"
                            color="inherit"
                        >
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div >
    );
}