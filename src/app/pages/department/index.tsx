import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	TableHead,
	TableContainer,
	Paper,
	Box,
	Grid,
	Card,
	TablePagination,
	CardContent,
	CardActions,
	Modal,
	Typography
} from "@mui/material";
import {
	StyledTextField,
	CreateButton,
	EditButtonIcon,
	DeleteButtonIcon,
	StyledTable,
	StyledTableBody,
	StyledTableRow,
	StyledTableCell,
	DeleteButtonText,
	CancelButtonText,
	EditButtonText
} from "@app/components";
import {
	RootState,
	useAppDispatch,
	DepartmentData,
	getDepartments,
	createDepartment,
	editDepartment,
	deleteDepartment
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
		label: "Actions"
	}
];

interface Captions {
	name?: string;
}

export function DepartmentPage() {
	const dispatch = useAppDispatch();
	const { data, status } = useSelector((state: RootState) => state.departments.getDepartments);
	const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [openModal, setOpenModal] = useState(false);
	const [formModal, setFormModal] = useState<Partial<DepartmentData>>({});
	const [captionsModal, setCaptionsModal] = useState<Captions>();

	const getDepartmentsPaginated = () => {
		dispatch(getDepartments({ page, pageLimit: rowsPerPage }));
	};

	useEffect(() => {
		getDepartmentsPaginated();
	}, [page, rowsPerPage]);

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(formModal.name)) {
			captions.name = "Please enter a valid name";
		}

		setCaptionsModal(captions);

		return _.isEmpty(captions) ? true : false;
	};

	const performOpenModal = (mode: "create" | "edit" | "delete", row: Partial<DepartmentData>) => {
		setMode(mode);
		setFormModal(row);
		setOpenModal(true);
	};
	const performCloseModal = () => {
		setFormModal({});
		setOpenModal(false);
		setCaptionsModal({});
	};

	return (
		<Box>
			<Modal keepMounted={false} open={openModal} onClose={performCloseModal}>
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
									<StyledTextField
										fullWidth
										value={formModal.name}
										onChange={(e) => setFormModal({ ...formModal, name: e.target.value })}
										error={!_.isUndefined(captionsModal?.name) ? true : false}
										helperText={captionsModal?.name}
										placeholder="IT Department"
										label="Name"
									/>
								</Grid>
							</Grid>
						)}
					</CardContent>
					<CardActions sx={{ justifyContent: "center" }}>
						{mode === "create" ? (
							<CreateButton
								size="medium"
								onClick={() => {
									if (validate()) {
										dispatch(createDepartment(formModal as Omit<DepartmentData, "id">)).then(() =>
											getDepartmentsPaginated()
										);
										performCloseModal();
									}
								}}
							/>
						) : mode === "edit" ? (
							<EditButtonText
								onClick={() => {
									if (validate()) {
										dispatch(editDepartment(formModal)).then(() => getDepartmentsPaginated());
										performCloseModal();
									}
								}}
							/>
						) : (
							<DeleteButtonText
								onClick={() => {
									dispatch(deleteDepartment({ id: formModal.id as number })).then(() =>
										getDepartmentsPaginated()
									);
								}}
							/>
						)}
						<Box width={20} />
						<CancelButtonText
							onClick={() => {
								performCloseModal();
							}}
						/>
					</CardActions>
				</Card>
			</Modal>
			<Box py={4} display="flex">
				<Box flexGrow={1} />
				<CreateButton onClick={() => performOpenModal("create", {})} />
			</Box>
			<Paper
				sx={{
					boxShadow: "rgba(145, 158, 171, 0.25) 0px 0px 3px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px"
				}}
			>
				<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
					<StyledTable
						overlay={status === "pending" ? "loading" : _.isEmpty(data) ? "empty" : "none"}
						sx={{ minWidth: { md: 300 } }}
						size="small"
					>
						<TableHead>
							<StyledTableRow>
								{tableCells.map((cell) => {
									return (
										<StyledTableCell align="center" variant="head">
											{cell.label.toUpperCase()}
										</StyledTableCell>
									);
								})}
							</StyledTableRow>
						</TableHead>
						<StyledTableBody loadingCellWidths={["10%", "60%", "15%"]}>
							{data.map((row) => {
								return (
									<StyledTableRow key={row.id}>
										<StyledTableCell sx={{ fontWeight: 500 }} align="center" width="10%">
											{row.id}
										</StyledTableCell>
										<StyledTableCell align="center" width="60%">
											{row.name}
										</StyledTableCell>
										<StyledTableCell align="center" width="15%">
											<Box display="inline-block" p={0.5}>
												<EditButtonIcon onClick={() => performOpenModal("edit", row)} />
											</Box>
											<Box display="inline-block" p={0.5}>
												<DeleteButtonIcon onClick={() => performOpenModal("delete", row)} />
											</Box>
										</StyledTableCell>
									</StyledTableRow>
								);
							})}
						</StyledTableBody>
					</StyledTable>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={-1}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(e, page) => setPage(page)}
					onRowsPerPageChange={(e) => {
						setRowsPerPage(_.toInteger(e.target.value));
						setPage(0);
					}}
				/>
			</Paper>
		</Box>
	);
}
