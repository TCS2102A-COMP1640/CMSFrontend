import React, { memo } from "react";
import { Button, ButtonProps } from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";

function CancelButtonTextInternal(props: ButtonProps) {
	return (
		<Button
			endIcon={<CancelOutlined sx={{ fill: "white" }} />}
			sx={{
				backgroundColor: "rgb(133, 139, 148)",
				color: "white",
				"&:hover": {
					backgroundColor: "rgb(116, 120, 130)",
					color: "white"
				},
				minWidth: 110,
				...props.sx
			}}
			{...props}
		>
			Cancel
		</Button>
	);
}

export const CancelButtonText = memo(CancelButtonTextInternal);
