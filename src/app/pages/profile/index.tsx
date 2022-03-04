import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Paper, Typography } from "@mui/material";
import { RootState, getProfile, RoleData, DepartmentData } from "@app/redux";
import _ from "lodash";

export function ProfilePage() {
	const dispatch = useDispatch();
	const { profile } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		dispatch(getProfile());
	}, []);

	return (
		<Box sx={{ flexGrow: 1, overflow: "hidden", px: 3 }}>
			<Paper sx={{ maxWidth: 300, my: 1, mx: "auto", p: 2 }}>
				<Typography style={{ fontSize: 25 }}>
					Name: {profile?.firstName} {profile?.lastName}
				</Typography>
				<Typography>Email: {profile?.email}</Typography>
				<Typography>Role: {(profile?.role as RoleData)?.name}</Typography>
				<Typography>Department: {(profile?.department as DepartmentData)?.name ?? "Unassigned"} </Typography>
			</Paper>
		</Box>
	);
}
