import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary
}));

export function ProfilePage() {
	return (
		<Grid container direction="column" px={15} spacing={2}>
			`{" "}
			<Grid item alignSelf="center">
				<Typography variant="h5">Profile</Typography>
			</Grid>
			<Box sx={{ flexGrow: 1, overflow: "hidden", px: 3 }}>
				<Paper sx={{ maxWidth: 500, my: 1, mx: "auto", p: 2 }}>
					<Grid container wrap="nowrap" spacing={2}>
						<Grid item>
							<Button>
								<Avatar style={{ height: 100, width: 100 }}>J</Avatar>
							</Button>
						</Grid>
						<Grid item xs>
							<Typography style={{ fontSize: 30 }}>Name:Jonh Holland</Typography>
							<Typography>Phone: +84 021255458</Typography>
							<Typography>Role: QA Manager</Typography>
							<Typography>Description: Like Dog, Play game, etc. </Typography>
						</Grid>
					</Grid>
				</Paper>
			</Box>
			`
		</Grid>
	);
}
