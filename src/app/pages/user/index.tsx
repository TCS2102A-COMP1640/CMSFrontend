import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Grid, Typography, Autocomplete } from "@mui/material";
import {
	RootState,
	useAppDispatch,
	UserData,
	getUsers,
	createUser,
	editUser,
	deleteUser,
	getRolesByName,
	RoleData,
	DepartmentData,
	getDepartmentsByName
} from "@app/redux";
import _ from "lodash";
import { StyledTextField, StyledTableForm } from "@app/components";
import { isEmail, TableCellMapper } from "@app/utils";

const tableCells: TableCellMapper<UserData>[] = [
	{
		label: "ID",
		align: "center",
		width: "5%",
		mapper: (data) => _.toString(data.id)
	},
	{
		label: "Name",
		align: "left",
		width: "10%",
		mapper: (data) => (
			<>
				<Typography>
					{data.firstName} {data.lastName}
				</Typography>
				<Typography sx={{ color: "GrayText", fontSize: "13px" }}>{data.email}</Typography>
			</>
		)
	},
	{
		label: "Role",
		align: "center",
		width: "5%",
		mapper: (data) => (data.role as RoleData).name
	},
	{
		label: "Department",
		align: "center",
		width: "5%",
		mapper: (data) => (data.department as DepartmentData)?.name ?? "Unassigned"
	}
];

interface Captions {
	email?: string;
	password?: string;
	firstName?: string;
	lastName?: string;
	role?: string;
}

export function UserPage() {
	const dispatch = useAppDispatch();
	const { data: usersData, status: usersStatus } = useSelector((state: RootState) => state.users.getUsers);
	const { data: rolesData, status: rolesStatus } = useSelector((state: RootState) => state.roles.getRolesByName);
	const { data: departmentsData, status: departmentsStatus } = useSelector(
		(state: RootState) => state.departments.getDepartmentsByName
	);
	const [form, setForm] = useState<Partial<UserData>>({});
	const [captions, setCaptions] = useState<Captions>();

	const getDepartmentsBySearch = useMemo(
		() =>
			_.throttle((name) => {
				dispatch(getDepartmentsByName({ name }));
			}, 200),
		[]
	);
	const getRolesBySearch = useMemo(
		() =>
			_.throttle((name) => {
				dispatch(getRolesByName({ name }));
			}, 200),
		[]
	);

	const validate = (mode: string) => {
		const captions: Captions = {};

		if (_.isEmpty(form.email) || !isEmail(form.email ?? "")) {
			captions.email = "Please enter valid email";
		}

		if (_.isEmpty(form.password) && mode === "create") {
			captions.password = "Please enter a valid password";
		}

		if (_.isEmpty(form.firstName)) {
			captions.firstName = "Please enter your first name";
		}

		if (_.isEmpty(form.lastName)) {
			captions.lastName = "Please enter your last name";
		}

		if (_.isUndefined(form.role)) {
			captions.role = "Please choose a role";
		}

		setCaptions(captions);

		return _.isEmpty(captions) ? true : false;
	};

	return (
		<StyledTableForm
			name="User"
			data={usersData}
			formContent={
				<Grid container direction="row" spacing={2}>
					<Grid item xs={6}>
						<StyledTextField
							fullWidth
							value={form.firstName}
							onChange={(e) => setForm({ ...form, firstName: e.target.value })}
							error={!_.isUndefined(captions?.firstName) ? true : false}
							helperText={captions?.firstName}
							label="First name"
						/>
					</Grid>
					<Grid item xs={6}>
						<StyledTextField
							fullWidth
							value={form.lastName}
							onChange={(e) => setForm({ ...form, lastName: e.target.value })}
							error={!_.isUndefined(captions?.lastName) ? true : false}
							helperText={captions?.lastName}
							label="Last name"
						/>
					</Grid>
					<Grid item xs={6}>
						<StyledTextField
							fullWidth
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							error={!_.isUndefined(captions?.email) ? true : false}
							helperText={captions?.email}
							label="Email"
						/>
					</Grid>
					<Grid item xs={6}>
						<StyledTextField
							fullWidth
							type="password"
							value={form.password}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
							error={!_.isUndefined(captions?.password) ? true : false}
							helperText={captions?.password}
							label="Password"
						/>
					</Grid>
					<Grid item xs={6}>
						<Autocomplete
							fullWidth
							value={form.department as DepartmentData}
							options={departmentsData}
							filterSelectedOptions
							autoComplete
							filterOptions={(options) => options}
							getOptionLabel={(option) => option.name}
							loading={departmentsStatus === "pending"}
							renderInput={(params) => <StyledTextField label="Department" {...params} />}
							onChange={(e, value) => {
								setForm({
									...form,
									department: _.isNull(value) ? undefined : (value as DepartmentData)
								});
							}}
							onInputChange={(e, value) => {
								getDepartmentsBySearch(value);
							}}
						/>
					</Grid>
					<Grid item xs={6}>
						<Autocomplete
							fullWidth
							value={form.role as RoleData}
							options={rolesData}
							filterSelectedOptions
							autoComplete
							filterOptions={(options) => options}
							getOptionLabel={(option) => option.name}
							loading={rolesStatus === "pending"}
							renderInput={(params) => (
								<StyledTextField
									label="Role"
									error={!_.isUndefined(captions?.role) ? true : false}
									helperText={captions?.role}
									{...params}
								/>
							)}
							onChange={(e, value) => {
								setForm({
									...form,
									role: _.isNull(value) ? undefined : (value as RoleData)
								});
							}}
							onInputChange={(e, value) => {
								getRolesBySearch(value);
							}}
						/>
					</Grid>
				</Grid>
			}
			tableCellMappers={tableCells}
			tableOverlay={usersStatus === "pending" ? "loading" : _.isEmpty(usersData) ? "empty" : "none"}
			onFormOpen={(data) => {
				setForm(data);
			}}
			onFormClose={() => {
				setCaptions({});
			}}
			onFormCreate={(shouldClose, { page, pageLimit, mode }) => {
				if (validate(mode)) {
					dispatch(
						createUser({
							...form,
							role: (form.role as RoleData)?.id,
							department: (form.department as DepartmentData)?.id
						} as Omit<UserData, "id">)
					).then(() => dispatch(getUsers({ page, pageLimit })));
					shouldClose();
				}
			}}
			onFormEdit={(shouldClose, { page, pageLimit, mode }) => {
				if (validate(mode)) {
					dispatch(
						editUser({
							...form,
							role: (form.role as RoleData)?.id,
							department: (form.department as DepartmentData)?.id
						})
					).then(() => dispatch(getUsers({ page, pageLimit })));
					shouldClose();
				}
			}}
			onFormDelete={(shouldClose, { page, pageLimit }) => {
				dispatch(deleteUser({ id: form.id as number })).then(() => dispatch(getUsers({ page, pageLimit })));
				shouldClose();
			}}
			onTablePagination={({ page, pageLimit }) => {
				dispatch(getUsers({ page, pageLimit }));
			}}
		/>
	);
}
