import React from "react";
import { TextField, TextFieldProps, styled, InputLabel } from "@mui/material";
import _ from "lodash";

const StyledTextFieldInternal = styled(TextField)(({ theme }) => ({
	"& .MuiOutlinedInput-root": {}
}));

export function StyledTextField(props: TextFieldProps) {
	const { label, ...textFieldProps } = props;

	return (
		<>
			{!_.isUndefined(label) && <InputLabel sx={{ pb: "8px", fontWeight: 500 }}>{label}</InputLabel>}
			<StyledTextFieldInternal
				InputProps={{
					sx: {
						borderRadius: 5,
						minHeight: 50,
						...textFieldProps.InputProps?.sx
					},
					...textFieldProps.InputProps
				}}
				FormHelperTextProps={{
					sx: {
						fontSize: 13,
						...textFieldProps.FormHelperTextProps?.sx
					},
					...textFieldProps.FormHelperTextProps
				}}
				{...textFieldProps}
			/>
		</>
	);
}
