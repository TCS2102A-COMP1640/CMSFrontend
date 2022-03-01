import React, { memo } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { pushMessage, RootState } from "@app/redux";
import { isTokenExpired } from "@app/utils";

function AuthRequiredInternal() {
	const { token } = useSelector((state: RootState) => state.auth);
	const expired = isTokenExpired(token);

	if (expired) {
		pushMessage({ message: "Your session expired. Please login again.", severity: "info" });
	}

	return expired ? <Navigate to="/login" replace /> : <Outlet />;
}

export const AuthRequired = memo(AuthRequiredInternal);
