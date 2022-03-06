import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Typography, Avatar, List, ListItem, ListItemText, ListItemAvatar, Paper } from "@mui/material";
import { RootState, getProfile, RoleData, DepartmentData } from "@app/redux";
import { EmailRounded, ApartmentRounded, GroupRounded } from "@mui/icons-material";
import _ from "lodash";

function stringToColor(string: string) {
	let hash = 0;
	let i;

	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.substr(-2);
	}

	return color;
}

export function ProfilePage() {
	const dispatch = useDispatch();
	const { profile } = useSelector((state: RootState) => state.auth);
	const name = `${profile?.firstName} ${profile?.lastName}`;

	useEffect(() => {
		dispatch(getProfile());
	}, []);

	return (
		<Box mt={6} display="flex" justifyContent="center">
			<Paper
				sx={{
					py: 4,
					px: 6,
					maxWidth: 350,
					borderRadius: 5,
					boxShadow: "rgba(145, 158, 171, 0.25) 0px 0px 3px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px"
				}}
			>
				<Grid container alignContent="center" direction="row" spacing={2}>
					<Grid item xs={12} sx={{ textAlign: "center" }}>
						<Avatar
							variant="rounded"
							sx={{
								width: 100,
								height: 100,
								display: "inline-flex",
								bgcolor: stringToColor(name)
							}}
							children={`${name.split(" ")[0][0]}${name.split(" ")[1][0]}`}
						/>
						<Typography sx={{ fontSize: 25, pt: 2, pl: 1 }}>{name}</Typography>
					</Grid>
					<Grid item xs={2.5} />
					<Grid item>
						<List
							sx={{
								"& .MuiListItem-root": {
									borderBottom: "1px solid rgb(230, 232, 240)"
								},
								"& .MuiListItemAvatar-root": {
									minWidth: 40
								}
							}}
						>
							<ListItem>
								<ListItemAvatar>
									<EmailRounded color="primary" />
								</ListItemAvatar>
								<ListItemText primary="Email" secondary={profile?.email} />
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<GroupRounded color="action" />
								</ListItemAvatar>
								<ListItemText primary="Role" secondary={(profile?.role as RoleData)?.name} />
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<ApartmentRounded color="action" />
								</ListItemAvatar>
								<ListItemText
									primary="Department"
									secondary={(profile?.department as DepartmentData)?.name ?? "Unassigned"}
								/>
							</ListItem>
						</List>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
}
