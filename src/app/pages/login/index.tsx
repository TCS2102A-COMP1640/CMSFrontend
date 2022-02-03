import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, loginToAccount } from "@app/redux";
import { Container, Box, Button, TextField, Grid } from "@mui/material";

function LoginPage() {
	//Testing
	const dispatch = useDispatch();
	const { token } = useSelector((state: RootState) => state.auth);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	console.log(token);

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
				<TextField
					placeholder="Email"
					onInput={(e) => {
						setEmail((e.target as HTMLInputElement).value);
					}}
				/>
			</Grid>
			<Grid item>
				<TextField
					placeholder="Password"
					onInput={(e) => {
						setPassword((e.target as HTMLInputElement).value);
					}}
				/>
			</Grid>
			<Grid item>
				<Button
					type="submit"
					variant="contained"
					onClick={() => {
						console.log(email);
						console.log(password);
					}}
				>
					Submit
				</Button>
			</Grid>
		</Grid>
	);
}

export { LoginPage };
