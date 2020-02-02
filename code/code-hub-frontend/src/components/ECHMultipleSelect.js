import React, { Component, } from 'react';
import { Select, InputLabel, MenuItem, Checkbox, ListItemText, Input, FormControl } from '@material-ui/core'

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

        const inputLabelStyle = {
            textAlign: 'left',
            width: this.props.width || '200px',
        }

        const selectFieldStyle = {
            textAlign: 'left',
            width: '100%'
        }

        const regularFormControlStyle = {
            width: this.props.width || '200px',
            paddingBottom: '1.5vw'
        }

        const filterBarFormControlStyle = {
            width: this.props.width || '200px',
            paddingBottom: '1.5vw',
            paddingTop: '1.5vw'
        }

        const isMultiple = this.props.multiple ?? true
        const formControlStyle = this.props.useInFilterBar
            ? filterBarFormControlStyle
            : regularFormControlStyle
        return <FormControl style={{ ...formControlStyle, ...this.props.style }}>
            <InputLabel style={inputLabelStyle} id="select-label">{this.props.title}</InputLabel>
            <Select
                style={selectFieldStyle}
                labelId="select-label"
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
                {(this.props.options || []).map(option => {
                    return <MenuItem key={option} value={option} style={{ whiteSpace: 'normal' }}>
                        <Checkbox color="primary" checked={this.itemIsChecked(option)} />
                        <ListItemText primary={option} />
                    </MenuItem>
                })}
            </Select>
        </FormControl>
    }

    itemIsChecked = (option) => (this.props.value || []).indexOf(option) > -1
}

export default ECHMultipleSelect;