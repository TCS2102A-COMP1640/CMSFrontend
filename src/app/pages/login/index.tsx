import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Grid, CircularProgress, Typography } from "@mui/material";
import { RootState, loginToAccount } from "@app/redux";
import { isTokenExpired, isEmail } from "@app/utils";
import _ from "lodash";

interface Captions {
	email?: string;
	password?: string;
}

export function LoginPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token, status } = useSelector((state: RootState) => state.auth);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [captions, setCaptions] = useState<Captions>({});

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(email) || !isEmail(email)) {
			captions.email = "Please enter a valid email";
		}

		if (_.isEmpty(password)) {
			captions.password = "Please enter a valid password";
		}

		setCaptions(captions);

		return _.isEmpty(captions) ? true : false;
	};

	useEffect(() => {
		if (!isTokenExpired(token)) {
            console.log(token);
			navigate("/");
		}
	});

	return (
		<Grid
			container
			spacing={2}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: "100vh" }}
		>
			<Grid item>
				<Typography variant="h4">Login</Typography>
			</Grid>
			<Grid item>
				<Box
					sx={{
						width: 300,
						border: "1px dashed grey",
						p: 5
					}}
				>
					<Grid container spacing={3} direction="column">
						<Grid item>
							<TextField
								fullWidth
								type="email"
								label="Email"
								error={captions.email ? true : false}
								helperText={captions.email}
								onChange={(e) => setEmail(e.target.value)}
								InputProps={{
									sx: {
										borderRadius: 0,
										height: 35
									}
								}}
								InputLabelProps={{
									sx: {
										top: !_.isEmpty(email) ? 0 : -9,
										"&.Mui-focused": {
											top: 0
										}
									}
								}}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								type="password"
								label="Password"
								error={captions.password ? true : false}
								helperText={captions.password}
								onChange={(e) => setPassword(e.target.value)}
								InputProps={{
									sx: {
										borderRadius: 0,
										height: 35
									}
								}}
								InputLabelProps={{
									sx: {
										top: !_.isEmpty(password) ? 0 : -9,
										"&.Mui-focused": {
											top: 0
										}
									}
								}}
							>
								Password
							</TextField>
						</Grid>
						<Grid item>
							<Button
								fullWidth
								type="submit"
								variant="contained"
								onClick={() => {
									if (validate()) {
										if (status === "idle") {
											dispatch(loginToAccount({ email, password }));
										}
									}
								}}
							>
								{status === "pending" ? (
									<CircularProgress size={24} sx={{ color: "white" }} />
								) : (
									"Submit"
								)}
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Grid>
		</Grid>
	);
}
