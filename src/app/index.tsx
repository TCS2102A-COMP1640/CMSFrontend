import React from "react";
import { Routes, Route } from "react-router";
import { LoginPage } from "@app/pages";

export function App(props: {}) {
	return (
		<Routes>
			<Route path="/" element={<LoginPage />} />
		</Routes>
	);
}
