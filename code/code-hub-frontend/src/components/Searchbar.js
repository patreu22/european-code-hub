import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, InputBase } from '@material-ui/core'
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
    divider: {
        marginLeft: 10
    },
    inputInput: {
        width: '100%',
        padding: theme.spacing(1, 1, 1, 7),
        backgroundColor: 'inherit',
    },
}));

class Searchbar extends React.Component {
    // function Searchbar() {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         currentSearchText: '',
    //     };
    //     this._onTextChanged = this._onTextChanged.bind(this)
    // }

    render() {
        const classes = useStyles();
        return (
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    {/* <Link to="/search/"> */}
                    <SearchIcon />
                    <Divider orientation="vertical" className={classes.divider} />
                    {/* </Link> */}
                </div >
                <InputBase
                    placeholder="What are you looking for..?"
                    // onChange={this._onTextChanged}
                    className={classes.inputInput}
                />
            </div>
        );
    }


    // _onTextChanged(event) {
    //     console.log(event)
    //     const text = event.target.value
    //     this.setState({
    //         currentSearchText: text
    //     }, () => console.log(`CurrentText: ${this.state.currentSearchText}`))
    // }
}

export default Searchbar;