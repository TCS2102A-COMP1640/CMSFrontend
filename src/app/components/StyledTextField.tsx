import React from "react";
import { TextField, TextFieldProps, styled, InputLabel } from "@mui/material";
import _ from "lodash";

const StyledTextFieldInternal = styled(TextField)(({ theme }) => ({
	"& .MuiOutlinedInput-root": {}
}));

export function StyledTextField(props: TextFieldProps) {
	const { label, ...textFieldProps } = props;

	return (
		<React.Fragment>
			{!_.isUndefined(label) && <InputLabel sx={{ pb: "8px", fontWeight: 500 }}>{label}</InputLabel>}
			<StyledTextFieldInternal
				InputProps={{
					sx: {
						borderRadius: 2,
						height: 50
					}
				}}
				FormHelperTextProps={{
					sx: { fontSize: 13 }
				}}
				{...textFieldProps}
			/>
		</React.Fragment>
	);
}
