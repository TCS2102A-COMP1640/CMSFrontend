import React, { memo } from "react";
import { Button, ButtonProps } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";

function DeleteButtonTextInternal(props: ButtonProps) {
	return (
		<Button
			endIcon={<DeleteOutlined sx={{ fill: "white" }} />}
			sx={{
				backgroundColor: "rgb(245, 85, 64)",
				color: "white",
				"&:hover": {
					backgroundColor: "rgb(252, 108, 88)",
					color: "white"
				},
				minWidth: 110,
				...props.sx
			}}
			{...props}
		>
			Delete
		</Button>
	);
}

export const DeleteButtonText = memo(DeleteButtonTextInternal);
