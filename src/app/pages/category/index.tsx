
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
	}
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
// function createData(
// 	Categories: string,
// 	View: number,
// 	ThumpUp: number,
// 	Lastestdate: Date,
// 	Oldestdate: Date,
//   ) {
// 	return { Categories, View, ThumpUp, Lastestdate, Oldestdate };
//   }

//   const rows = [
// 	createData('Hot Girl', 359, 1000, 2/2/2019, 2/2/2021),
// 	createData('Hot Student', 237, 2000, 20/10/2017, 20/10/2019),
// 	createData('View School', 123, 300, 21/11/2015, 21/11/2021),
// 	createData('Teacher', 305, 200, 21/11/2015, 21/11/2021),
// 	createData('Confession', 356, 430, 1/1/2012, 1/1/2021),
//   ];

// export default function BasicTable() {
// 	return (
// 	  <TableContainer component={Paper}>
// 		<Table sx={{ minWidth: 650 }} aria-label="simple table">
// 		  <TableHead>
// 			<TableRow>
// 			  <TableCell>Dessert (100g serving)</TableCell>
// 			  <TableCell align="right">View</TableCell>
// 			  <TableCell align="right">Thump&nbsp;Up</TableCell>
// 			  <TableCell align="right">Lastest&nbsp;Date</TableCell>
// 			  <TableCell align="right">Oldest&nbsp;Date</TableCell>
// 			</TableRow>
// 		  </TableHead>
// 		  <TableBody>
// 			{rows.map((row) => (
// 			  <TableRow
// 				key={row.name}
// 				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
// 			  >
// 				<TableCell component="th" scope="row">
// 				  {row.name}
// 				</TableCell>
// 				<TableCell align="right">{row.View}</TableCell>
// 				<TableCell align="right">{row.ThumpUp}</TableCell>
// 				<TableCell align="right">{row.Lastestdate}</TableCell>
// 				<TableCell align="right">{row.Oldestdate}</TableCell>
// 			  </TableRow>
// 			))}
// 		  </TableBody>
// 		</Table>
// 	  </TableContainer>
// 	);
//   }
