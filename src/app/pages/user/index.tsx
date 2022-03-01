import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	TableContainer,
	Paper,
	Box,
	Grid,
	Toolbar,
	Button,
	IconButton,
	Card,
	TextField,
	CardContent,
	CardActions,
	Modal,
	Typography,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	FormHelperText
} from "@mui/material";
import { AddCircleOutlined, EditOutlined, DeleteOutlined, CancelOutlined } from "@mui/icons-material";
import {
	RootState,
	useAppDispatch,
	UserData,
	getUsers,
	createUser,
	editUser,
	deleteUser,
	getRoles,
	getDepartments,
	RoleData,
	DepartmentData
} from "@app/redux";
import _ from "lodash";

const tableCells = [
	{
		label: "ID"
	},
	{
		label: "Email"
	},
	{
		label: "First Name"
	},
	{
		label: "Last Name"
	},
	{
		label: "Role"
	},
	{
		label: "Department"
	},
	{
		label: "Actions"
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
	const { data: usersData } = useSelector((state: RootState) => state.users.getUsers);
	const { data: rolesData } = useSelector((state: RootState) => state.roles.getRoles);
	const { data: departmentsData } = useSelector((state: RootState) => state.departments.getDepartments);
	const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
	const [openModal, setOpenModal] = useState(false);
	const [formModal, setFormModal] = useState<Partial<UserData>>({});
	const [captionsModal, setCaptionsModal] = useState<Captions>();

	useEffect(() => {
		dispatch(getUsers());
		dispatch(getRoles());
		dispatch(getDepartments());
	}, []);

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(formModal.email)) {
			captions.email = "Please enter a name";
		}

		if (_.isEmpty(formModal.password) && mode === "create") {
			captions.password = "Please enter a valid password";
		}

		if (_.isEmpty(formModal.firstName)) {
			captions.firstName = "Please enter your first name";
		}

		if (_.isEmpty(formModal.lastName)) {
			captions.lastName = "Please enter your last name";
		}

		if (_.isUndefined(formModal.role)) {
			captions.role = "Please choose a role";
		}

		setCaptionsModal(captions);

		return _.isEmpty(captions) ? true : false;
	};

	const performOpenModal = (mode: "create" | "edit" | "delete", row: Partial<UserData>) => {
		setMode(mode);
		setFormModal({
			...row,
			role: _.get(row, ["role", "id"], undefined),
			department: _.get(row, ["department", "id"], undefined)
		});
		setOpenModal(true);
	};
	const performCloseModal = () => {
		setFormModal({});
		setOpenModal(false);
		setCaptionsModal({});
	};

	return (
		<Box px={{ sm: 0, md: 7 }}>
			<Modal open={openModal} onClose={performCloseModal}>
				<Card
					sx={{
						minWidth: { xs: 310, sm: 450 },
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)"
					}}
				>
					<CardContent>
						{mode === "delete" ? (
							<Typography textAlign="center" variant="h6">
								Confirmation
							</Typography>
						) : (
							<Grid container direction="column" spacing={2}>
								<Grid item>
									<TextField
										fullWidth
										value={formModal.email}
										onChange={(e) => setFormModal({ ...formModal, email: e.target.value })}
										error={!_.isUndefined(captionsModal?.email) ? true : false}
										helperText={captionsModal?.email}
										label="Email"
									/>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										value={formModal.firstName}
										onChange={(e) => setFormModal({ ...formModal, firstName: e.target.value })}
										error={!_.isUndefined(captionsModal?.firstName) ? true : false}
										helperText={captionsModal?.firstName}
										label="First name"
									/>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										value={formModal.lastName}
										onChange={(e) => setFormModal({ ...formModal, lastName: e.target.value })}
										error={!_.isUndefined(captionsModal?.lastName) ? true : false}
										helperText={captionsModal?.lastName}
										label="Last name"
									/>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										type="password"
										value={formModal.password}
										onChange={(e) => setFormModal({ ...formModal, password: e.target.value })}
										error={!_.isUndefined(captionsModal?.password) ? true : false}
										helperText={captionsModal?.password}
										label="Password"
									/>
								</Grid>
								<Grid item>
									<FormControl fullWidth>
										<InputLabel
											id="select-role-label"
											sx={{
												top: _.isUndefined(formModal.role) ? -9 : 0,
												"&.Mui-focused": {
													top: 0
												}
											}}
										>
											Role
										</InputLabel>
										<Select
											labelId="select-role-label"
											label="Role"
											value={formModal.role}
											error={!_.isUndefined(captionsModal?.role) ? true : false}
											onChange={(e) =>
												setFormModal({ ...formModal, role: e.target.value as number })
											}
											sx={{
												height: 36
											}}
										>
											{rolesData.map((role) => {
												return (
													<MenuItem key={role.id} value={role.id}>
														{role.name}
													</MenuItem>
												);
											})}
										</Select>
										<FormHelperText error={!_.isUndefined(captionsModal?.role) ? true : false}>
											{captionsModal?.role}
										</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item>
									<FormControl fullWidth>
										<InputLabel id="select-department-label">Department</InputLabel>
										<Select
											labelId="select-department-label"
											label="Department"
											value={_.isUndefined(formModal.department) ? -1 : formModal.department}
											onChange={(e) =>
												setFormModal({
													...formModal,
													department:
														(e.target.value as number) === -1
															? undefined
															: (e.target.value as number)
												})
											}
											sx={{
												height: 36
											}}
										>
											<MenuItem key={-1} value={-1}>
												Unassigned
											</MenuItem>
											{departmentsData.map((department) => {
												return (
													<MenuItem key={department.id} value={department.id}>
														{department.name}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						)}
					</CardContent>
					<CardActions sx={{ justifyContent: "center" }}>
						<Button
							variant="outlined"
							onClick={() => {
								switch (mode) {
									case "create":
										if (validate()) {
											dispatch(createUser(formModal as Omit<UserData, "id">)).then(() =>
												dispatch(getUsers())
											);
											performCloseModal();
										}
										return;
									case "edit":
										if (validate()) {
											dispatch(editUser(formModal)).then(() => dispatch(getUsers()));
										}
										break;
									case "delete":
										dispatch(deleteUser({ id: formModal.id as number })).then(() =>
											dispatch(getUsers())
										);
										break;
								}
								performCloseModal();
							}}
							endIcon={
								mode === "create" ? (
									<AddCircleOutlined />
								) : mode === "edit" ? (
									<EditOutlined />
								) : (
									<DeleteOutlined />
								)
							}
						>
							{mode === "create" ? "Create" : mode === "edit" ? "Edit" : "Delete"}
						</Button>

						<Button
							variant="outlined"
							onClick={() => {
								performCloseModal();
							}}
							endIcon={<CancelOutlined />}
						>
							Cancel
						</Button>
					</CardActions>
				</Card>
			</Modal>
			<Paper>
				<Toolbar sx={{ alignContent: "center" }}>
					<Button
						fullWidth
						onClick={() => performOpenModal("create", {})}
						variant="outlined"
						endIcon={<AddCircleOutlined />}
					>
						Create
					</Button>
				</Toolbar>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: { md: 300 } }} size="small">
						<TableHead>
							<TableRow>
								{tableCells.map((cell) => {
									return (
										<TableCell sx={{ fontWeight: 600 }} align="center" variant="head">
											{cell.label}
										</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{usersData.map((row) => {
								return (
									<TableRow
										hover
										key={row.id}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell align="center">{row.id}</TableCell>
										<TableCell align="center">{row.email}</TableCell>
										<TableCell align="center">{row.firstName}</TableCell>
										<TableCell align="center">{row.lastName}</TableCell>
										<TableCell align="center">{(row.role as RoleData).name}</TableCell>
										<TableCell align="center">
											{(row.department as DepartmentData)?.name ?? "Unassigned"}
										</TableCell>
										<TableCell align="center">
											<IconButton onClick={() => performOpenModal("edit", row)}>
												<EditOutlined />
											</IconButton>
											<IconButton onClick={() => performOpenModal("delete", row)}>
												<DeleteOutlined />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
}
