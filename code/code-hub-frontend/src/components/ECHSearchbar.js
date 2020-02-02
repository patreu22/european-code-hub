import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, InputBase } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { getSearchSuggestion } from '../helper/httpHelper'

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        zIndex: 10
    },
    linkActivated: {
        pointerEvents: 'auto'
    },
    linkDeactivated: {
        pointerEvents: 'none'
    },
    divider: {
        marginLeft: 10
    },
    inputInput: {
        width: '100%',
        padding: theme.spacing(1, 1, 1, 7),
        backgroundColor: 'inherit',
    },
}));

// class Searchbar extends React.Component {
function ECHSearchbar(props) {
    const classes = useStyles();
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    return (
        <div>
            <div className={classes.search}>
                <Link to={`/search/${searchInput}`} className={_getClassName(searchInput, classes)}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                        <Divider orientation="vertical" className={classes.divider} />
                    </div >
                </Link>
                <Autocomplete
                    options={suggestions}
                    renderInput={params => (
                        // TODO: Fix Input base (example is with TextField)
                        <InputBase {...params} placeholder="What are you looking for..?"
                            onKeyDown={(e) => _handleKeyDown(e, props, searchInput)}
                            onChange={(event) => {
                                const input = event.target.value
                                if (input.length > 2) {
                                    getSearchSuggestion(input)
                                        .then((suggestions) => {
                                            setSuggestions(suggestions)
                                            console.log(suggestions)
                                        })
                                    //TODO: Get suggestions!
                                }
                            }}
                            className={classes.inputInput}
                        />
                    )}
                />
            </div>
        </div >
    );
}

function _handleInputChange(event) {
    const input = event.target.value
    if (input.length > 2) {
        getSearchSuggestion(input)
            .then((suggestions) => {
                this.setSuggestions(suggestions)
                console.log(suggestions)
            })
        //TODO: Get suggestions!
    }
}

function _getClassName(searchInput, classes) {
    return searchInput ? classes.linkActivated : classes.linkDeactivated;
}

function _handleKeyDown(event, props, searchInput) {
    if (event.key === 'Enter') {
        props.history.push(`/search/${searchInput}`);
    }
}

export default withRouter(ECHSearchbar);