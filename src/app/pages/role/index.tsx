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
	Dialog,
	DialogTitle,
	List,
	ListItem,
	ListItemText,
	FormControl,
	MenuItem,
	InputLabel,
	Select,
	Checkbox
} from "@mui/material";
import { AddCircleOutlined, EditOutlined, DeleteOutlined, CancelOutlined, ReadMoreOutlined } from "@mui/icons-material";
import {
	RootState,
	useAppDispatch,
	RoleData,
	getRoles,
	createRole,
	editRole,
	deleteRole,
	PermissionData,
	getPermissions
} from "@app/redux";
import _ from "lodash";

const tableCells = [
	{
		label: "ID"
	},
	{
		label: "Name"
	},
	{
		label: "Permissions"
	},
	{
		label: "Actions"
	}
];

interface Captions {
	name?: string;
}

interface PermissionNames {
	[index: number]: string;
}

export function RolePage() {
	const dispatch = useAppDispatch();
	const { data } = useSelector((state: RootState) => state.roles.getRoles);
	const { data: permissionsData } = useSelector((state: RootState) => state.permissions.getPermissions);
	const [permissionNames, setPermissionNames] = useState<PermissionNames>({});

	const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
	const [openModal, setOpenModal] = useState(false);
	const [formModal, setFormModal] = useState<Partial<RoleData>>({});
	const [captionsModal, setCaptionsModal] = useState<Captions>();

	const [openDialog, setOpenDialog] = useState(false);
	const [showingPermissions, setShowingPermissions] = useState<PermissionData[]>([]);

	useEffect(() => {
		dispatch(getRoles());
		dispatch(getPermissions());
	}, []);

	useEffect(() => {
		const names: PermissionNames = {};
		permissionsData.forEach((permission) => (names[permission.id] = permission.name));
		setPermissionNames(names);
	}, [permissionsData]);

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(formModal.name)) {
			captions.name = "Please enter a valid name";
		}

		setCaptionsModal(captions);

		return _.isEmpty(captions) ? true : false;
	};

	const performOpenModal = (mode: "create" | "edit" | "delete", row: Partial<RoleData>) => {
		setMode(mode);
		setFormModal({
			...row,
			permissions: row.permissions?.map((permission) => (permission as PermissionData).id) ?? []
		});
		setOpenModal(true);
	};
	const performCloseModal = () => {
		setFormModal({});
		setOpenModal(false);
		setCaptionsModal({});
	};

	const performOpenDialog = (permissions: PermissionData[]) => {
		setOpenDialog(true);
		setShowingPermissions(permissions);
	};

	const performCloseDialog = () => {
		setOpenDialog(false);
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
										value={formModal.name}
										onChange={(e) => setFormModal({ ...formModal, name: e.target.value })}
										error={!_.isUndefined(captionsModal?.name) ? true : false}
										helperText={captionsModal?.name}
										label="Name"
									/>
								</Grid>
								<Grid item>
									<FormControl sx={{ width: 418 }}>
										<InputLabel
											id="select-permissions-label"
											sx={{
												top:
													_.isUndefined(formModal.permissions) ||
													_.isEmpty(formModal.permissions)
														? -9
														: 0,
												"&.Mui-focused": {
													top: 0
												}
											}}
										>
											Permissions
										</InputLabel>
										<Select
											labelId="select-permissions-label"
											label="Permissions"
											value={formModal.permissions as number[]}
											multiple
											onChange={(e) =>
												setFormModal({ ...formModal, permissions: e.target.value as number[] })
											}
											sx={{
												height: 36
											}}
											renderValue={(selected) =>
												selected.map((id) => permissionNames[id]).join(", ")
											}
										>
											{permissionsData.map((permission) => {
												return (
													<MenuItem key={permission.id} value={permission.id}>
														<Checkbox
															checked={
																_.isUndefined(formModal.permissions)
																	? false
																	: (formModal.permissions as number[]).includes(
																			permission.id
																	  )
															}
														/>
														<ListItemText primary={permission.name} />
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
											dispatch(createRole(formModal as Omit<RoleData, "id">)).then(() =>
												dispatch(getRoles())
											);
											performCloseModal();
										}
										return;
									case "edit":
										if (validate()) {
											dispatch(editRole(formModal)).then(() => dispatch(getRoles()));
										}
										break;
									case "delete":
										dispatch(deleteRole({ id: formModal.id as number })).then(() =>
											dispatch(getRoles())
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
			<Dialog open={openDialog} onClose={performCloseDialog}>
				<DialogTitle>Permissions</DialogTitle>
				<List>
					{showingPermissions.map((permission) => (
						<ListItem>
							<ListItemText primary={permission.name} />
						</ListItem>
					))}
				</List>
			</Dialog>
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
							{data.map((row) => {
								return (
									<TableRow
										hover
										key={row.id}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell align="center">{row.id}</TableCell>
										<TableCell align="center">{row.name}</TableCell>
										<TableCell align="center">
											<IconButton
												onClick={() => performOpenDialog(row.permissions as PermissionData[])}
											>
												<ReadMoreOutlined />
											</IconButton>
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
