import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	Grid,
	Typography,
	Autocomplete,
	Checkbox,
	Chip,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent
} from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox, ReadMoreOutlined } from "@mui/icons-material";
import { StyledTextField, StyledTableForm } from "@app/components";
import {
	RootState,
	useAppDispatch,
	RoleData,
	PermissionData,
	getRoles,
	createRole,
	editRole,
	deleteRole,
	getPermissions
} from "@app/redux";
import { TableCellMapper } from "@app/utils";
import _ from "lodash";

const tableCells: TableCellMapper<RoleData>[] = [
	{
		label: "ID",
		align: "center",
		width: "10%",
		sx: {
			fontWeight: 500
		},
		mapper: (data) => _.toString(data.id)
	},
	{
		label: "Name",
		align: "center",
		width: "20%",
		mapper: (data) => data.name
	},
	{
		label: "Permissions",
		align: "center",
		width: "10%"
	}
];

interface Captions {
	name?: string;
}

function getColor(
	permission: PermissionData
): "default" | "success" | "primary" | "secondary" | "info" | "warning" | "error" {
	if (permission.name.startsWith("*")) {
		return "error";
	}
	if (permission.name.startsWith("user")) {
		return "secondary";
	}
	if (permission.name.startsWith("idea")) {
		return "primary";
	}
	if (permission.name.startsWith("role")) {
		return "warning";
	}
	if (permission.name.startsWith("department")) {
		return "info";
	}
	if (permission.name.startsWith("year")) {
		return "success";
	}
	return "default";
}

export function RolePage() {
	const dispatch = useAppDispatch();
	const { data, status } = useSelector((state: RootState) => state.roles.getRoles);
	const { data: permissionsData } = useSelector((state: RootState) => state.permissions.getPermissions);
	const [form, setForm] = useState<Partial<RoleData>>({});
	const [captions, setCaptions] = useState<Captions>();

	const [openDialog, setOpenDialog] = useState(false);
	const [permissions, setPermissions] = useState<PermissionData[]>([]);

	useEffect(() => {
		dispatch(getPermissions());
	}, []);

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(form.name)) {
			captions.name = "Please enter a valid name";
		}

		setCaptions(captions);

		return _.isEmpty(captions) ? true : false;
	};

	const performOpenDialog = (permissions: PermissionData[]) => {
		setOpenDialog(true);
		setPermissions(permissions);
	};

	const performCloseDialog = () => {
		setOpenDialog(false);
	};

	tableCells[2] = {
		...tableCells[2],
		mapper: (data) => (
			<IconButton onClick={() => performOpenDialog(data.permissions as PermissionData[])}>
				<ReadMoreOutlined />
			</IconButton>
		)
	};

	return (
		<>
			<Dialog open={openDialog} onClose={performCloseDialog}>
				<DialogTitle>Permissions</DialogTitle>
				<DialogContent sx={{ display: "flex", flexWrap: "wrap" }}>
					{_.isEmpty(permissions) ? (
						<Typography>None</Typography>
					) : (
						permissions.map((permission) => (
							<Chip
								color={getColor(permission)}
								label={permission.name}
								sx={{ flex: "1 0 21%", m: 0.4 }}
							/>
						))
					)}
				</DialogContent>
			</Dialog>
			<StyledTableForm
				name="Year"
				data={data}
				formContent={
					<Grid container direction="column" spacing={2}>
						<Grid item>
							<StyledTextField
								fullWidth
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								error={!_.isUndefined(captions?.name) ? true : false}
								helperText={captions?.name}
								placeholder="IT Role"
								label="Name"
							/>
						</Grid>
						<Grid item>
							<Autocomplete
								fullWidth
								multiple
								value={form.permissions as PermissionData[]}
								options={permissionsData}
								disableCloseOnSelect
								getOptionLabel={(option) => option.name}
								renderInput={(params) => <StyledTextField label="Permissions" {...params} />}
								renderOption={(props, option, { selected }) => (
									<li {...props}>
										<Checkbox
											icon={<CheckBoxOutlineBlank fontSize="small" />}
											checkedIcon={<CheckBox fontSize="small" />}
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										{option.name}
									</li>
								)}
								limitTags={8}
								onChange={(e, value) => {
									setForm({
										...form,
										permissions: _.sortBy(value, (v) => v.name[0])
									});
								}}
								renderTags={(value, getTagProps) => {
									return value.map((v, index) => (
										<Chip {...getTagProps({ index })} label={v.name} color={getColor(v)} />
									));
								}}
							/>
						</Grid>
					</Grid>
				}
				tableCellMappers={tableCells}
				tableOverlay={status === "pending" ? "loading" : _.isEmpty(data) ? "empty" : "none"}
				onFormOpen={(data) => {
					setForm(data);
				}}
				onFormClose={() => {
					setCaptions({});
				}}
				onFormCreate={(shouldClose, { page, pageLimit }) => {
					if (validate()) {
						dispatch(
							createRole({
								...form,
								permissions: (form.permissions as PermissionData[])?.map((p) => p.id)
							} as Omit<RoleData, "id">)
						).then(() => dispatch(getRoles({ page, pageLimit })));
						shouldClose();
					}
				}}
				onFormEdit={(shouldClose, { page, pageLimit }) => {
					if (validate()) {
						dispatch(
							editRole({ ...form, permissions: (form.permissions as PermissionData[])?.map((p) => p.id) })
						).then(() => dispatch(getRoles({ page, pageLimit })));
						shouldClose();
					}
				}}
				onFormDelete={(shouldClose, { page, pageLimit }) => {
					dispatch(deleteRole({ id: form.id as number })).then(() => dispatch(getRoles({ page, pageLimit })));
					shouldClose();
				}}
				onTablePagination={({ page, pageLimit }) => {
					dispatch(getRoles({ page, pageLimit }));
				}}
			/>
		</>
	);
}
