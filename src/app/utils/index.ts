import { SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";
import _ from "lodash";

export const APITimeout = 10000;
export const APIBase = "http://localhost:5000";
export const APIPaths = {
	Auth: `${APIBase}/auth`,
	Ideas: `${APIBase}/ideas`,
	Categories: `${APIBase}/categories`,
	Years: `${APIBase}/years`,
	Users: `${APIBase}/users`,
	Roles: `${APIBase}/roles`,
	Departments: `${APIBase}/departments`,
	Permissions: `${APIBase}/permissions`
};

export type Status = "idle" | "pending";

export interface PaginationPayload {
	page: number;
	pageLimit: number;
}

export interface TableCellMapper<T> {
	label: string;
	align: "center" | "left";
	width: string;
	sx?: SxProps<Theme>;
	mapper?: (value: T) => string | ReactNode;
}

export interface FetchParams {
	path: string;
	params?: { [index: string]: any };
	body?: { [index: string]: any } | FormData;
	query?: { [index: string]: any };
	multipart?: boolean;
	token?: string;
	method: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
	mode?: RequestMode;
}

export function isEmail(email: string) {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

export function isTokenExpired(token: string) {
	if (_.isEmpty(token)) {
		return true;
	}
	try {
		const jwt = JSON.parse(atob(token.split(".")[1]));
		if (!_.has(jwt, "exp") || jwt.exp * 1000 < Date.now()) {
			return true;
		}
		return false;
	} catch (err) {
		console.error(err);
		return true;
	}
}

export async function fetchHandler(p: FetchParams) {
	const { path, params, body, query, token, method, multipart, mode } = p;
	try {
		const abort = new AbortController();
		const signal = abort.signal;
		const headers = new Headers();
		if (!_.isNil(body) && !(body instanceof FormData)) {
			headers.set("Content-Type", "application/json");
		}
		if (!_.isNil(token) && !_.isEmpty(token)) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		const timeoutId = setTimeout(() => abort.abort(), APITimeout);

		let requestPath = path;
		for (const param in params) {
			requestPath = requestPath.replace(`:${param}`, params[param].toString());
		}
		const requestQuery = !_.isNil(query) ? "?" + new URLSearchParams(_.pickBy(query, _.identity)).toString() : "";

		const response = await fetch(`${requestPath}${requestQuery}`, {
			method,
			signal,
			headers,
			mode: mode || "cors",
			body: !(body instanceof FormData)
				? JSON.stringify(body)
				: (() => {
						if (multipart) {
							return body;
						}
						const formData = new URLSearchParams();
						for (const pair of body.entries()) {
							formData.append(pair[0], pair[1] as string);
						}
						return formData;
				  })()
		});
		clearTimeout(timeoutId);
		if (response.status >= 300) {
			throw {
				statusCode: response.status,
				statusMessage: (await response.json()).message
			};
		}
		return {
			status: response.status,
			data: response.headers.get("content-type")?.indexOf("application/json") !== -1 ? await response.json() : {}
		};
	} catch (error) {
		console.error(error);
		return {
			status: _.get(error, "statusCode", 500),
			data: {},
			error:
				error instanceof Error
					? error
					: new Error(_.get(error, "statusMessage", "Something wrong happened. Please try again later."))
		};
	}
}
