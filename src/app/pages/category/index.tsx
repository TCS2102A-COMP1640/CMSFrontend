import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { StyledTextField, StyledTableForm } from "@app/components";
import {
	RootState,
	useAppDispatch,
	CategoryData,
	getCategories,
	createCategory,
	editCategory,
	deleteCategory
} from "@app/redux";
import { TableCellMapper } from "@app/utils";
import _ from "lodash";

const tableCells: TableCellMapper<CategoryData>[] = [
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
		width: "50%",
		mapper: (data) => data.name
	}
];

interface Captions {
	name?: string;
	openingDate?: string;
	closureDate?: string;
	finalClosureDate?: string;
}

export function CategoryPage() {
	const dispatch = useAppDispatch();
	const { data, status } = useSelector((state: RootState) => state.categories.getCategories);
	const [form, setForm] = useState<Partial<CategoryData>>({});
	const [captions, setCaptions] = useState<Captions>();

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(form.name)) {
			captions.name = "Please enter a valid name";
		}

		setCaptions(captions);

		return _.isEmpty(captions) ? true : false;
	};

	return (
		<StyledTableForm
			name="Category"
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
							placeholder="Innovation"
							label="Name"
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
					dispatch(createCategory(form as Omit<CategoryData, "id">)).then(() =>
						dispatch(getCategories({ page, pageLimit }))
					);
					shouldClose();
				}
			}}
			onFormEdit={(shouldClose, { page, pageLimit }) => {
				if (validate()) {
					dispatch(editCategory(form)).then(() => dispatch(getCategories({ page, pageLimit })));
					shouldClose();
				}
			}}
			onFormDelete={(shouldClose, { page, pageLimit }) => {
				dispatch(deleteCategory({ id: form.id as number })).then(() =>
					dispatch(getCategories({ page, pageLimit }))
				);
				shouldClose();
			}}
			onTablePagination={({ page, pageLimit }) => {
				dispatch(getCategories({ page, pageLimit }));
			}}
		/>
	);
}
