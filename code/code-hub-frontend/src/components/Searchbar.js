import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles(theme => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#f5f5f5',
        '&:hover': {
            backgroundColor: '#DBDBDB',
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        zIndex: 10
    },

    inputInput: {
        width: '100%',
        padding: theme.spacing(1, 1, 1, 7),
        backgroundColor: 'inherit',
    },
}));

export default function Searchbar() {
    const classes = useStyles();
    return (
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                placeholder="What are you looking for..?"
                className={classes.inputInput}
            />
        </div>
    );
}