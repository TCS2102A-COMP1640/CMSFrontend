import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { StyledTextField, StyledTableForm } from "@app/components";
import { RootState, useAppDispatch, YearData, getYears, createYear, editYear, deleteYear } from "@app/redux";
import { TableCellMapper } from "@app/utils";
import { isValid, format, addDays } from "date-fns";
import _ from "lodash";

const tableCells: TableCellMapper<YearData>[] = [
	{
		label: "ID",
		align: "center",
		width: "5%",
		sx: {
			fontWeight: 500
		},
		mapper: (data) => _.toString(data.id)
	},
	{
		label: "Name",
		align: "center",
		width: "15%",
		mapper: (data) => data.name
	},
	{
		label: "Opening date",
		align: "center",
		width: "10%",
		sx: {
			fontFamily: "Inter"
		},
		mapper: (data) => format(data.openingDate, "dd/MM/yyyy")
	},
	{
		label: "Closure date",
		align: "center",
		width: "10%",
		sx: {
			color: "#ed6c02",
			fontFamily: "Inter"
		},
		mapper: (data) => format(data.closureDate, "dd/MM/yyyy")
	},
	{
		label: "Final closure date",
		align: "center",
		width: "15%",
		sx: {
			color: "rgb(245, 85, 64)",
			fontFamily: "Inter"
		},
		mapper: (data) => format(data.finalClosureDate, "dd/MM/yyyy")
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
	const { data, status } = useSelector((state: RootState) => state.years.getYears);
	const [form, setForm] = useState<Partial<YearData>>({});
	const [captions, setCaptions] = useState<Captions>();
	const [openingDateError, setOpeningDateError] = useState(false);

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(form.name)) {
			captions.name = "Please enter a valid name";
		}

		if (!isValid(form.openingDate) || openingDateError) {
			captions.openingDate = "Please enter a valid date";
		}

		if (!isValid(form.closureDate)) {
			captions.closureDate = "Please enter a valid date";
		}

		if (!isValid(form.finalClosureDate)) {
			captions.finalClosureDate = "Please enter a valid date";
		}

		setCaptions(captions);

		return _.isEmpty(captions) ? true : false;
	};

	return (
		<StyledTableForm
			name="Year"
			data={data}
			formContent={
				<Grid container direction="row" spacing={2}>
					<Grid item xs={6}>
						<StyledTextField
							fullWidth
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							error={!_.isUndefined(captions?.name) ? true : false}
							helperText={captions?.name}
							placeholder="Spring Year"
							label="Name"
						/>
					</Grid>
					<Grid item xs={6}>
						<DatePicker
							inputFormat="dd/MM/yyyy"
							label="Opening date"
							value={_.isUndefined(form.openingDate) ? null : form.openingDate}
							onChange={(v) => {
								setForm({ ...form, openingDate: _.isNull(v) ? undefined : v });
							}}
							onError={(error, v) => {
								setOpeningDateError(!_.isNull(error) ? true : false);
							}}
							renderInput={(params) => (
								<StyledTextField
									fullWidth
									{...params}
									helperText={captions?.openingDate}
									error={!_.isUndefined(captions?.openingDate) ? true : params.error}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<DatePicker
							inputFormat="dd/MM/yyyy"
							label="Closure date"
							value={_.isUndefined(form.closureDate) ? null : form.closureDate}
							minDate={isValid(form.openingDate) ? addDays(form.openingDate as Date, 1) : undefined}
							onChange={(v) => {
								setForm({ ...form, closureDate: _.isNull(v) ? undefined : v });
							}}
							onError={(error, v) => {
								if (error === "minDate") {
									setForm({
										...form,
										closureDate: addDays(form.openingDate as Date, 1)
									});
								}
							}}
							renderInput={(params) => (
								<StyledTextField
									fullWidth
									{...params}
									helperText={captions?.closureDate}
									error={!_.isUndefined(captions?.closureDate) ? true : params.error}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<DatePicker
							inputFormat="dd/MM/yyyy"
							label="Final closure date"
							value={_.isUndefined(form.finalClosureDate) ? null : form.finalClosureDate}
							minDate={form.closureDate}
							onChange={(v) => {
								setForm({
									...form,
									finalClosureDate: _.isNull(v) ? undefined : v
								});
							}}
							onError={(error, v) => {
								if (error === "minDate") {
									setForm({
										...form,
										finalClosureDate: form.closureDate as Date
									});
								}
							}}
							renderInput={(params) => (
								<StyledTextField
									fullWidth
									{...params}
									helperText={captions?.finalClosureDate}
									error={!_.isUndefined(captions?.finalClosureDate) ? true : params.error}
								/>
							)}
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
					dispatch(createYear(form as Omit<YearData, "id">)).then(() =>
						dispatch(getYears({ page, pageLimit }))
					);
					shouldClose();
				}
			}}
			onFormEdit={(shouldClose, { page, pageLimit }) => {
				if (validate()) {
					dispatch(editYear(form)).then(() => dispatch(getYears({ page, pageLimit })));
					shouldClose();
				}
			}}
			onFormDelete={(shouldClose, { page, pageLimit }) => {
				dispatch(deleteYear({ id: form.id as number })).then(() => dispatch(getYears({ page, pageLimit })));
				shouldClose();
			}}
			onTablePagination={({ page, pageLimit }) => {
				dispatch(getYears({ page, pageLimit }));
			}}
		/>
	);
}
