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
	Typography
} from "@mui/material";
import { AddCircleOutlined, EditOutlined, DeleteOutlined, CancelOutlined } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { RootState, useAppDispatch, YearData, getYears, createYear, editYear, deleteYear } from "@app/redux";
import { isValid, addDays, format } from "date-fns";
import _ from "lodash";

const tableCells = [
	{
		label: "ID"
	},
	{
		label: "Name"
	},
	{
		label: "Opening date"
	},
	{
		label: "Closure date"
	},
	{
		label: "Final closure date"
	},
	{
		label: "Actions"
	}
];

interface Captions {
	name?: string;
	openingDate?: string;
	closureDate?: string;
	finalClosureDate?: string;
}

export function YearPage() {
	const dispatch = useAppDispatch();
	const { data } = useSelector((state: RootState) => state.years.getYears);
	const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
	const [openModal, setOpenModal] = useState(false);
	const [formModal, setFormModal] = useState<Partial<YearData>>({});
	const [openingDateError, setOpeningDateError] = useState(false);
	const [captionsModal, setCaptionsModal] = useState<Captions>();

	useEffect(() => {
		dispatch(getYears());
	}, []);

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(formModal.name)) {
			captions.name = "Please enter a valid name";
		}

		if (!isValid(formModal.openingDate) || openingDateError) {
			captions.openingDate = "Please enter a valid date";
		}

		if (!isValid(formModal.closureDate)) {
			captions.closureDate = "Please enter a valid date";
		}

		if (!isValid(formModal.finalClosureDate)) {
			captions.finalClosureDate = "Please enter a valid date";
		}

		setCaptionsModal(captions);

		return _.isEmpty(captions) ? true : false;
	};

	const performOpenModal = (mode: "create" | "edit" | "delete", row: Partial<YearData>) => {
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
									<DatePicker
										inputFormat="dd/MM/yyyy"
										label="Opening date"
										value={_.isUndefined(formModal.openingDate) ? null : formModal.openingDate}
										onChange={(v) => {
											setFormModal({ ...formModal, openingDate: _.isNull(v) ? undefined : v });
										}}
										onError={(error, v) => {
											setOpeningDateError(!_.isNull(error) ? true : false);
										}}
										renderInput={(params) => (
											<TextField
												fullWidth
												{...params}
												helperText={captionsModal?.openingDate}
												error={!_.isUndefined(captionsModal?.openingDate) ? true : params.error}
											/>
										)}
									/>
								</Grid>
								<Grid item>
									<DatePicker
										inputFormat="dd/MM/yyyy"
										label="Closure date"
										value={_.isUndefined(formModal.closureDate) ? null : formModal.closureDate}
										minDate={
											isValid(formModal.openingDate)
												? addDays(formModal.openingDate as Date, 1)
												: undefined
										}
										onChange={(v) => {
											setFormModal({ ...formModal, closureDate: _.isNull(v) ? undefined : v });
										}}
										onError={(error, v) => {
											if (error === "minDate") {
												setFormModal({
													...formModal,
													closureDate: addDays(formModal.openingDate as Date, 1)
												});
											}
										}}
										renderInput={(params) => (
											<TextField
												fullWidth
												{...params}
												helperText={captionsModal?.closureDate}
												error={!_.isUndefined(captionsModal?.closureDate) ? true : params.error}
											/>
										)}
									/>
								</Grid>
								<Grid item>
									<DatePicker
										inputFormat="dd/MM/yyyy"
										label="Final closure date"
										value={
											_.isUndefined(formModal.finalClosureDate)
												? null
												: formModal.finalClosureDate
										}
										minDate={formModal.closureDate}
										onChange={(v) => {
											setFormModal({
												...formModal,
												finalClosureDate: _.isNull(v) ? undefined : v
											});
										}}
										onError={(error, v) => {
											if (error === "minDate") {
												setFormModal({
													...formModal,
													finalClosureDate: formModal.closureDate as Date
												});
											}
										}}
										renderInput={(params) => (
											<TextField
												fullWidth
												{...params}
												helperText={captionsModal?.finalClosureDate}
												error={
													!_.isUndefined(captionsModal?.finalClosureDate)
														? true
														: params.error
												}
											/>
										)}
									/>
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
											dispatch(createYear(formModal as Omit<YearData, "id">)).then(() =>
												dispatch(getYears())
											);
											performCloseModal();
										}
										return;
									case "edit":
										if (validate()) {
											dispatch(editYear(formModal)).then(() => dispatch(getYears()));
										}
										break;
									case "delete":
										dispatch(deleteYear({ id: formModal.id as number })).then(() =>
											dispatch(getYears())
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
							{data.map((row) => {
								return (
									<TableRow
										hover
										key={row.id}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell align="center">{row.id}</TableCell>
										<TableCell align="center">{row.name}</TableCell>
										<TableCell align="center">{format(row.openingDate, "dd/MM/yyyy")}</TableCell>
										<TableCell align="center">{format(row.closureDate, "dd/MM/yyyy")}</TableCell>
										<TableCell align="center">
											{format(row.finalClosureDate, "dd/MM/yyyy")}
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
