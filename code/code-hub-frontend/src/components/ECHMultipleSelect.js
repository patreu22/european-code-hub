import React, { Component, } from 'react';
import { Select, InputLabel, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core'

class ECHMultipleSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedList: []
        }

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 250,
                },
            },
        };

        const names = [
            'Oliver Hansen',
            'Van Henry',
            'April Tucker',
            'Ralph Hubbard',
            'Omar Alexander',
            'Carlos Abbott',
            'Miriam Wagner',
            'Bradley Wilkerson',
            'Virginia Andrews',
            'Kelly Snyder',
        ];

        const inputFieldStyle = {
            width: '80%',
            paddingBottom: '1.5vw'
        }

        const inputLabelStyle = {
            textAlign: 'left',
        }

        const selectStyle = {
            display: 'flex',
            alignContent: 'center',
        }

        return <div style={inputFieldStyle}>
            <div style={selectStyle}>
                <InputLabel style={inputLabelStyle} id="multiple-checkbox-field-label">{this.props.title}</InputLabel>
            </div>
            <Select
                style={{ textAlign: 'left', width: '100%' }}
                labelId="multiple-checkbox-field-label"
                multiple={true}
                value={this.state.selectedList}
                onChange={this.handleChange}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
            >
                {names.map(name => {
                    console.log("Name: " + name)
                    console.log("Array: " + this.state.selectedList.indexOf(name))
                    return <MenuItem key={name} value={name}>
                        <Checkbox color="primary" checked={this.state.selectedList.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                    </MenuItem>
                })}
            </Select>
        </div >
    }

    handleChange(event) {
        this.setState({
            selectedList: event.target.value
        })
    };
}

export default ECHMultipleSelect;