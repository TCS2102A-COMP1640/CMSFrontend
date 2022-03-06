import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, CircularProgress, Typography } from "@mui/material";
import { AssignmentIndRounded } from "@mui/icons-material";
import { RootState, loginToAccount } from "@app/redux";
import { isTokenExpired, isEmail } from "@app/utils";
import { StyledTextField } from "@app/components";
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
			sx={{ minHeight: "100vh" }}
		>
			<Grid item>
				<AssignmentIndRounded
					htmlColor="rgb(80, 72, 229)"
					sx={{
						width: "3em",
						height: "3em"
					}}
				/>
			</Grid>
			<Grid item>
				<Typography variant="h3">Login</Typography>
			</Grid>
			<Grid item />
			<Grid item>
				<Box
					sx={{
						width: 400,
						p: 5,
						borderRadius: 5,
						boxShadow:
							"rgba(145, 158, 171, 0.25) 0px 0px 3px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px"
					}}
				>
					<Grid container spacing={3} direction="column">
						<Grid item>
							<StyledTextField
								fullWidth
								type="email"
								label="Email"
								error={!_.isUndefined(captions.email) ? true : false}
								helperText={captions.email}
								onChange={(e) => setEmail(e.target.value)}
								InputProps={{
									sx: {
										height: 36
									}
								}}
							/>
						</Grid>
						<Grid item>
							<StyledTextField
								fullWidth
								type="password"
								label="Password"
								error={!_.isUndefined(captions.password) ? true : false}
								helperText={captions.password}
								onChange={(e) => setPassword(e.target.value)}
								InputProps={{
									sx: {
										height: 36
									}
								}}
							/>
						</Grid>
						<Grid item>
							<Button
								fullWidth
								type="submit"
								variant="contained"
								sx={{
									backgroundColor: "rgb(80, 72, 229)",
									"&:hover": {
										backgroundColor: "rgb(56, 50, 160)"
									}
								}}
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
									"Login"
								)}
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Grid>
		</Grid>
	);
}
