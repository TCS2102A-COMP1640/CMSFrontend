import React, { memo } from "react";
import { Button, ButtonProps } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";

function EditButtonTextInternal(props: ButtonProps) {
	return (
		<Button
			endIcon={<EditOutlined sx={{ fill: "white" }} />}
			sx={{
				backgroundColor: "rgb(33, 43, 54)",
				color: "white",
				"&:hover": {
					backgroundColor: "rgb(51, 62, 82)",
					color: "white"
				},
				minWidth: 110,
				...props.sx
			}}
			{...props}
		>
			Edit
		</Button>
	);
}

export const EditButtonText = memo(EditButtonTextInternal);
