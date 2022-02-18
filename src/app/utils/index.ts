import _ from "lodash";

export const APITimeout = 10000;
export const APIBase = "http://localhost:5000";
export const APIPaths = {
	Auth: `${APIBase}/auth`,
	Ideas: `${APIBase}/ideas`,
	Years: `${APIBase}/years`
};

export type Status = "idle" | "pending";

export interface FetchParams {
	path: string;
	params?: { [index: string]: any };
	body?: { [index: string]: any } | FormData;
	query?: { [index: string]: any };
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
	const { path, params, body, query, token, method, mode } = p;
	try {
		const abort = new AbortController();
		const signal = abort.signal;
		const headers = new Headers();
		if (!_.isNil(body)) {
			headers.set(
				"Content-Type",
				body instanceof FormData ? "application/x-www-form-urlencoded" : "application/json"
			);
		}
		if (!_.isNil(token) && !_.isEmpty(token)) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		const timeoutId = setTimeout(() => abort.abort(), APITimeout);

		let requestPath = path;
		for (const param in params) {
			requestPath = requestPath.replace(`:${param}`, params[param].toString());
		}
		const requestQuery = !_.isNil(query) ? "?" + new URLSearchParams(query).toString() : "";

		const response = await fetch(`${requestPath}${requestQuery}`, {
			method,
			signal,
			headers,
			mode: mode || "cors",
			body: JSON.stringify(body)
		});
		clearTimeout(timeoutId);
		return {
			status: response.status,
			data: response.status >= 200 && response.status <= 206 ? await response.json() : {}
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			data: {},
			error: error instanceof Error ? error : new Error("Something wrong happened. Please try again later.")
		};
	}
}
