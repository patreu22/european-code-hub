import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { getSearchSuggestion } from '../helper/httpHelper'
import { SEARCH, SEARCHTERM_QUERY } from '../routes'

const useStyles = makeStyles(theme => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
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
        backgroundColor: 'inherit',
        padding: theme.spacing(1, 1, 1, 7),
        width: `calc(100% - 100px)`
    },
    fullComponent: props => ({
        backgroundColor: props.noBackgroundColor ? 'inherit' : '#f5f5f5',
        '&:hover': {
            backgroundColor: props.noBackgroundColor ? 'inherit' : '#DBDBDB',
        },
    })
}));

// class Searchbar extends React.Component {
function ECHSearchbar(props) {
    const classes = useStyles(props);
    const [searchInput, setSearchInput] = useState(props.initialValue || '');
    const [suggestions, setSuggestions] = useState([]);
    const [searchSuggestionsOpened, setSearchSuggestionsOpened] = useState(false);

    const _handleInputChange = (value) => {
        const input = value
        setSearchInput(input)
        if (input) {
            if (input.length > 2) {
                setSearchSuggestionsOpened(true)
                getSearchSuggestion(input)
                    .then((suggestions) => {
                        setSuggestions(suggestions)
                        console.log(suggestions)
                    })
            } else {
                setSearchSuggestionsOpened(false)
            }
        } else {
            setSearchSuggestionsOpened(false)
        }
    }

    const _handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (suggestions.length !== 0) {
                if (searchSuggestionsOpened) {
                    //Don't move anywhere, just pass the changes to the state
                    setSearchSuggestionsOpened(false)
                    setSearchInput(event.target.value)
                } else {
                    //Everything set, go to search page
                    if (searchInput) {
                        props.history.push(`${SEARCH}${SEARCHTERM_QUERY}${searchInput}`);
                    }
                }
            } else {
                //Plain text, no suggestions
                setSearchInput(event.target.value)
                if (searchInput) {
                    props.history.push(`${SEARCH}${SEARCHTERM_QUERY}${searchInput}`);
                }
            }
        }
    }

    return (
        <div className={classes.fullComponent}>
            <div className={classes.search}>
                <Link to={`${SEARCH}${SEARCHTERM_QUERY}${searchInput}`} className={_getClassName(searchInput, classes)}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                        <Divider orientation="vertical" className={classes.divider} />
                    </div >
                </Link>
                <Autocomplete
                    autoComplete
                    filterSelectedOptions
                    freeSolo
                    open={searchSuggestionsOpened}
                    disableOpenOnFocus
                    value={searchInput}
                    forcePopupIcon={false}
                    onChange={(_, value) => {
                        _handleInputChange(value)
                        setSearchSuggestionsOpened(false)
                    }}
                    noOptionsText={"No suggestions..."}
                    options={suggestions}
                    renderInput={(params) => <TextField
                        {...params}
                        placeholder="What are you looking for..?"
                        onKeyDown={(e) => _handleKeyDown(e, props)}
                        onChange={(event) => _handleInputChange(event.target.value)}
                        className={classes.inputInput}
                    />
                    }
                />
            </div>
        </div >
    );
}

function _getClassName(searchInput, classes) {
    return searchInput ? classes.linkActivated : classes.linkDeactivated;
}

export default withRouter(ECHSearchbar);