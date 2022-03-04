import React, { memo } from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";

function EditButtonIconInternal(props: IconButtonProps) {
	return (
		<IconButton {...props}>
			<EditOutlined sx={{ fill: "rgb(33, 43, 54)" }} />
		</IconButton>
	);
}

export const EditButtonIcon = memo(EditButtonIconInternal);
