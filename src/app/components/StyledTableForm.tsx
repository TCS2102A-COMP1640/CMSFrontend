import React, { useState, useEffect, ReactNode } from "react";
import { Box, Paper, TableContainer, TableHead, TablePagination } from "@mui/material";
import {
	EditButtonIcon,
	DeleteButtonIcon,
	StyledForm,
	PrimaryButton,
	EditButtonText,
	CancelButtonText,
	DeleteButtonText,
	StyledTable,
	StyledTableBody,
	StyledTableCell,
	StyledTableRow
} from "@app/components";
import { TableCellMapper } from "@app/utils";
import _ from "lodash";

type FormMode = "create" | "edit" | "delete";

interface TableState {
	page: number;
	pageLimit: number;
	mode: FormMode;
}

type OnFormCreateEditDelete = (shouldClose: () => void, state: TableState) => void;

export interface StyledTableFormProps<T> {
	name: string;
	data: T[];
	tableCellMappers: TableCellMapper<T>[];
	tableOverlay: "loading" | "empty" | "none";
	formContent: ReactNode;
	onFormOpen: (data: Partial<T>) => void;
	onFormClose: () => void;
	onFormCreate: OnFormCreateEditDelete;
	onFormEdit: OnFormCreateEditDelete;
	onFormDelete: OnFormCreateEditDelete;
	onTablePagination: (state: TableState) => void;
}

export function StyledTableForm<T>(props: StyledTableFormProps<T>) {
	const {
		name,
		data,
		tableCellMappers,
		tableOverlay,
		formContent,
		onFormOpen,
		onFormClose,
		onFormCreate,
		onFormEdit,
		onFormDelete,
		onTablePagination
	} = props;

	const [mode, setMode] = useState<FormMode>("create");
	const [page, setPage] = useState(0);
	const [pageLimit, setPageLimit] = useState(5);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		onTablePagination({ page, pageLimit, mode });
	}, [page, pageLimit]);

	const performOpenForm = (mode: FormMode, data: Partial<T>) => {
		onFormOpen(data);
		setMode(mode);
		setOpen(true);
	};
	const performCloseForm = () => {
		onFormClose();
		setOpen(false);
	};
	const tableCellMappersNew: TableCellMapper<T>[] = [
		...tableCellMappers,
		{
			label: "Actions",
			width: "15%",
			align: "center",
			mapper: (data) => (
				<>
					<Box display="inline-block" p={0.5}>
						<EditButtonIcon onClick={() => performOpenForm("edit", data)} />
					</Box>
					<Box display="inline-block" p={0.5}>
						<DeleteButtonIcon onClick={() => performOpenForm("delete", data)} />
					</Box>
				</>
			)
		}
	];

	return (
		<Box>
			{open ? (
				<StyledForm
					title={`${mode[0].toUpperCase() + mode.substring(1)} ${name.toLowerCase()}`}
					cardProps={{
						sx: {
							mt: 10
						}
					}}
					cardContent={formContent}
					cardActions={
						<>
							{mode === "create" ? (
								<PrimaryButton
									size="medium"
									onClick={() => {
										onFormCreate(performCloseForm, { page, pageLimit, mode });
									}}
								/>
							) : mode === "edit" ? (
								<EditButtonText
									onClick={() => {
										onFormEdit(performCloseForm, { page, pageLimit, mode });
									}}
								/>
							) : (
								<DeleteButtonText
									onClick={() => {
										onFormDelete(performCloseForm, { page, pageLimit, mode });
									}}
								/>
							)}
							<Box width={20} />
							<CancelButtonText
								onClick={() => {
									performCloseForm();
								}}
							/>
						</>
					}
				/>
			) : (
				<>
					<Box py={4} display="flex">
						<Box flexGrow={1} />
						<PrimaryButton onClick={() => performOpenForm("create", {})} />
					</Box>
					<Paper
						sx={{
							boxShadow:
								"rgba(145, 158, 171, 0.25) 0px 0px 3px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px"
						}}
					>
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							<StyledTable overlay={tableOverlay} sx={{ minWidth: { md: 300 } }} size="small">
								<TableHead>
									<StyledTableRow>
										{tableCellMappersNew.map((mapper) => {
											return (
												<StyledTableCell
													align={mapper.align}
													width={mapper.width}
													variant="head"
												>
													{mapper.label.toUpperCase()}
												</StyledTableCell>
											);
										})}
									</StyledTableRow>
								</TableHead>
								<StyledTableBody tableCellMappers={tableCellMappersNew}>
									{data.map((row) => {
										return (
											<StyledTableRow>
												{tableCellMappersNew.map((mapper, i) => {
													return (
														<StyledTableCell
															sx={mapper.sx}
															align={mapper.align}
															width={mapper.width}
														>
															{mapper.mapper?.(row)}
														</StyledTableCell>
													);
												})}
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
							rowsPerPage={pageLimit}
							page={page}
							onPageChange={(e, page) => setPage(page)}
							onRowsPerPageChange={(e) => {
								setPageLimit(_.toInteger(e.target.value));
								setPage(0);
							}}
						/>
					</Paper>
				</>
			)}
		</Box>
	);
}
