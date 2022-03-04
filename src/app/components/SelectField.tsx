import React from "react";
import { FormControl, FormControlProps, InputLabel, InputLabelProps, Select, SelectProps } from "@mui/material";
import _ from "lodash";

interface SelectFieldProps extends FormControlProps {
	inputLabelProps: InputLabelProps;
	selectProps: Omit<SelectProps, "children">;
	children?: React.ReactNode;
}

export function SelectField(props: SelectFieldProps) {
	const { inputLabelProps, selectProps, children, ...formControlProps } = props;
	const id = _.uniqueId();

	return (
		<FormControl {...formControlProps}>
			<InputLabel {...inputLabelProps} id={id}>
				{selectProps.label}
			</InputLabel>
			<Select {...selectProps} labelId={id}>
				{children}
			</Select>
		</FormControl>
	);
}
