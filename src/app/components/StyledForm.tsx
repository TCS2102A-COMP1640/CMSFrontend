import React, { memo } from "react";
import { Card, CardHeader, CardProps, CardContent, CardActions, Divider } from "@mui/material";

interface StyledFormProps {
	title: string;
	cardProps?: CardProps;
	cardContent: React.ReactNode;
	cardActions: React.ReactNode;
}

function StyledFormInternal(props: StyledFormProps) {
	const { title, cardProps, cardContent, cardActions } = props;

	return (
		<Card
			{...cardProps}
			sx={{
				...cardProps?.sx,
				minWidth: { xs: 310, sm: 450 },
				p: 3,
				boxShadow: "rgba(145, 158, 171, 0.25) 0px 0px 3px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px"
			}}
		>
			<CardHeader sx={{ pb: 0 }} title={title} />
			<CardContent>
				<Divider sx={{ mb: 3 }} />
				{cardContent}
			</CardContent>
			<CardActions sx={{ justifyContent: "center" }}>{cardActions}</CardActions>
		</Card>
	);
}

export const StyledForm = memo(StyledFormInternal);
