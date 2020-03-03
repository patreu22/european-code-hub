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
        const value = this.props.sortField
            ? ([this.props.value] ?? []).map((value) => this.getSortByMap()[value])
            : (this.props.value ?? [])
        const optionsToDisplay = this.props.sortField
            ? (selectOptions ?? []).map((value) => this.getSortByMap()[value])
            : selectOptions

        return <FormControl style={{ ...formControlStyle, ...this.props.style }}>
            <InputLabel style={inputLabelStyle} id="select-label">{this.props.title}</InputLabel>
            <Select
                style={selectFieldStyle}
                labelId="select-label"
                multiple={isMultiple}
                value={value}
                onChange={this.onChange}
                input={<Input />}
                renderValue={isMultiple
                    ? (selected) => selected.join(', ')
                    : (selected) => selected
                }
                MenuProps={MenuProps}
            >
                {optionsToDisplay.map(option => this._getMenuElement(option))}
            </Select>
        </FormControl>
    }

    onChange = (event) => {
        if (this.props.sortField) {
            const value = event.target.value
            const readableValue = this.getReversedSortMap()[value][0]
            const artificialEvent = { target: { value: readableValue } }
            this.props.onChange(artificialEvent)
        } else {
            this.props.onChange(event)
        }
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

    getSortByMap = () => {
        return {
            "projectName": "Project name",
            "organization": "Organization"
        }
    }

    getReversedSortMap = () => {
        return this.reverseMapping(this.getSortByMap())
    }

    reverseMapping = o => Object.keys(o).reduce((r, k) =>
        Object.assign(r, { [o[k]]: (r[o[k]] || []).concat(k) }), {})

    itemIsChecked = (option) => {
        if (this.props.sortField) {
            const sortKey = this.getReversedSortMap()[option]
            return (this.props.value || []).indexOf(sortKey) > -1
        } else {
            return (this.props.value || []).indexOf(option) > -1
        }
    }
}

export default ECHMultipleSelect;