import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { getSearchSuggestion } from '../helper/httpHelper'

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
    fullComponentStyle: {
        backgroundColor: '#f5f5f5',
        '&:hover': {
            backgroundColor: '#DBDBDB',
        },
    }
}));

// class Searchbar extends React.Component {
function ECHSearchbar(props) {
    const classes = useStyles();
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchSuggestionsOpened, setSearchSuggestionsOpened] = useState(false);

    const _handleInputChange = (event) => {
        const input = event.target.value
        if (input.length > 2) {
            setSearchSuggestionsOpened(true)
            getSearchSuggestion(input)
                .then((suggestions) => {
                    setSuggestions(suggestions)
                    setSearchInput(input)
                    console.log(suggestions)
                })
        } else {
            setSearchSuggestionsOpened(false)
        }
    }

    const _handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (searchSuggestionsOpened) {
                setSearchSuggestionsOpened(false)
                setSearchInput(event.target.value)
            } else {
                props.history.push(`/search/${searchInput}`);
            }

        }
    }

    return (
        <div className={classes.fullComponentStyle}>
            <div className={classes.search}>
                <Link to={`/search/${searchInput}`} className={_getClassName(searchInput, classes)}>
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
                    forcePopupIcon={false}
                    // TODO: Bulletproof? - check edge cases
                    onChange={() => setSearchSuggestionsOpened(false)}
                    noOptionsText={"No suggestions..."}
                    options={suggestions}
                    renderInput={(params) => <TextField
                        {...params}
                        placeholder="What are you looking for..?"
                        onKeyDown={(e) => _handleKeyDown(e, props)}
                        onChange={_handleInputChange}
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