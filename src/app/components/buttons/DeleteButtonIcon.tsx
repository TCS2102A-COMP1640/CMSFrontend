import React, { memo } from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";

function DeleteButtonIconInternal(props: IconButtonProps) {
	return (
		<IconButton {...props}>
			<DeleteOutlined sx={{ fill: "rgb(245, 85, 64)" }} />
		</IconButton>
	);
}

export const DeleteButtonIcon = memo(DeleteButtonIconInternal);
