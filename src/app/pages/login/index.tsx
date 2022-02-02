import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, loginToAccount } from "@app/redux";
import { Button, TextField } from "@mui/material";

function LoginPage(props: {}) {
	//Testing
	const dispatch = useDispatch();
	const { token } = useSelector((state: RootState) => state.auth);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		console.log(token);
	}, [dispatch]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				dispatch(loginToAccount({ email, password }));
			}}
		>
			<TextField
				id="outline-required"
				placeholder="Email"
				onInput={(e) => {
					setEmail((e.target as HTMLInputElement).value);
				}}
			/>
			<TextField
				id="outline-required"
				placeholder="Password"
				onInput={(e) => {
					setPassword((e.target as HTMLInputElement).value);
				}}
			/>
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
		</form>
	);
}

export { LoginPage };
