import React, { memo } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@app/redux";
import { isTokenExpired } from "@app/utils";

function AuthRequiredInternal() {
	const { token } = useSelector((state: RootState) => state.auth);
	return isTokenExpired(token) ? <Navigate to="/login" replace /> : <Outlet />;
}

export const AuthRequired = memo(AuthRequiredInternal);
