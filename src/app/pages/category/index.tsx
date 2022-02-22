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
import { RootState, useAppDispatch, CategoryData, getCategories } from "@app/redux";
import _ from "lodash";
import { createCategories, editCategories, deleteCategorise } from "@app/redux/categories";

const tableCells = [
	{
		label: "ID"
	},
	{
		label: "Name"
	},
];

interface Captions {
	name?: string;
}

export function CategoryPage() {
	const dispatch = useAppDispatch();
	const { data, status: getStatus } = useSelector((state: RootState) => state.categories.getCategories);
	//const { status: createStatus } = useSelector((state: RootState) => state.categories.createCategories);
	const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
	const [openModal, setOpenModal] = useState(false);
	const [formModal, setFormModal] = useState<Partial<CategoryData>>({});
	//const [yearsDataError, setYearsDateError] = useState(false);
	const [captionsModal, setCaptionsModal] = useState<Captions>();

	useEffect(() => {
		dispatch(getCategories());
	}, []);

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(formModal.name)) {
			captions.name = "Please enter a valid name";
		}

		setCaptionsModal(captions);

		return _.isEmpty(captions) ? true : false;
	};

	const performOpenModal = (mode: "create" | "edit" | "delete", row: Partial<CategoryData>) => {
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
											dispatch(createCategories(formModal as Omit<CategoryData, "id">)).then(() =>
												dispatch(getCategories())
											);
											performCloseModal();
										}
										return;
									case "edit":
										dispatch(editCategories(formModal)).then(() => dispatch(getCategories()));
										break;
									case "delete":
										dispatch(deleteCategorise({ id: formModal.id as number })).then(() =>
											dispatch(getCategories())
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
