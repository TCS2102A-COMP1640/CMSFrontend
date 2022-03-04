import React, { memo } from "react";
import { Button, ButtonProps } from "@mui/material";
import { AddCircleOutlined } from "@mui/icons-material";

function CreateButtonInternal(props: ButtonProps) {
	return (
		<Button
			size="large"
			variant="contained"
			endIcon={<AddCircleOutlined />}
			sx={{ backgroundColor: "#0072E5", minWidth: 110, ...props.sx }}
			{...props}
		>
			Create
		</Button>
	);
}

export const CreateButton = memo(CreateButtonInternal);
