import React, { Component, } from 'react';
import { Select, InputLabel, MenuItem, Checkbox, ListItemText, Divider, Input, FormControl } from '@material-ui/core'

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
        const selectOptions = this._getOptions()
        console.log("Select options: " + selectOptions)
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
                {selectOptions.map(option => this._getMenuElement(option))}
            </Select>
        </FormControl>
    }

    _getMenuElement(option) {
        if (option === "Reset filter") {
            return <MenuItem key={option} value={option} style={{ whiteSpace: 'normal', width: '100%' }}>
                <div style={{ width: "100%" }}>
                    <Divider style={{ width: '100%' }} />
                    <ListItemText inset primary={option} style={{ paddingTop: "5px" }} />
                </div>
            </MenuItem>
        } else {
            return <MenuItem key={option} value={option} style={{ whiteSpace: 'normal' }}>
                <Checkbox color="primary" checked={this.itemIsChecked(option)} />
                <ListItemText primary={option} />
            </MenuItem>
        }
    }

    _getOptions() {
        var optionsToDisplay = this.props.options || []
        if (this.props.displayResetOption) {
            optionsToDisplay.push("Reset filter")
        }
        return optionsToDisplay
    }

    itemIsChecked = (option) => (this.props.value || []).indexOf(option) > -1
}

export default ECHMultipleSelect;