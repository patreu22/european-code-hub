import React, { Component, } from 'react';
import { Select, InputLabel, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core'

class ECHMultipleSelect extends Component {
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

        const inputFieldStyle = {
            width: '80%',
            paddingBottom: '1.5vw',
            paddingTop: '1.5vw'
        }

        const inputLabelStyle = {
            textAlign: 'left',
        }

        const selectStyle = {
            display: 'flex',
            alignContent: 'center',
        }

        const selectFieldStyle = {
            textAlign: 'left',
            width: '100%'
        }

        const isMultiple = this.props.multiple ?? true
        return <div style={inputFieldStyle}>
            <div style={selectStyle}>
                <InputLabel style={inputLabelStyle} id="multiple-checkbox-field-label">{this.props.title}</InputLabel>
            </div>
            <Select
                style={selectFieldStyle}
                labelId="multiple-checkbox-field-label"
                multiple={isMultiple}
                value={this.props.value ?? []}
                onChange={this.props.onChange}
                input={<Input />}
                renderValue={isMultiple
                    ? (selected) => selected.join(', ')
                    : (selected) => selected
                }
                MenuProps={MenuProps}
            >
                {this.props.options.map(option => {
                    return <MenuItem key={option} value={option}>
                        <Checkbox color="primary" checked={this.props.value.indexOf(option) > -1} />
                        <ListItemText primary={option} />
                    </MenuItem>
                })}
            </Select>
        </div >
    }
}

export default ECHMultipleSelect;