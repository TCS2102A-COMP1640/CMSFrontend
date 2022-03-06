import React, { memo, ReactNode } from "react";
import { Button, ButtonProps } from "@mui/material";
import { AddCircleOutlined } from "@mui/icons-material";

export interface PrimaryButtonProps extends ButtonProps {
	text?: string | ReactNode;
}

function PrimaryButtonInternal(props: PrimaryButtonProps) {
	const { text, sx, ...buttonProps } = props;
	return (
		<Button
			size="large"
			variant="contained"
			endIcon={<AddCircleOutlined />}
			sx={{
				backgroundColor: "rgb(80, 72, 229)",
				"&:hover": {
					backgroundColor: "rgb(56, 50, 160)"
				},
				minWidth: 110,
				...sx
			}}
			{...buttonProps}
		>
			{text || "Create"}
		</Button>
	);
}

export const PrimaryButton = memo(PrimaryButtonInternal);
