import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
	Grid,
	Pagination,
	Theme,
	Card,
	Autocomplete,
	CardContent,
	CardActions,
	useMediaQuery,
	MenuItem,
	Chip,
	Box,
	IconButton,
	LinearProgress,
	Stack,
	Menu,
	Badge,
	CircularProgress,
	Button,
	Dialog,
	DialogContent,
	Checkbox,
	FormControlLabel
} from "@mui/material";
import {
	SendOutlined,
	LocalOfferOutlined,
	AttachmentRounded,
	FilterListRounded,
	DownloadRounded
} from "@mui/icons-material";
import {
	RootState,
	YearData,
	IdeaData,
	getIdeas,
	useAppDispatch,
	getYearsByName,
	createIdea,
	getCategoriesByName,
	CategoryData
} from "@app/redux";
import { Idea, StyledTextField } from "@app/components";
import _ from "lodash";
import { APIPaths } from "@app/utils";

type Order = "latest" | "views" | "reactions" | undefined;

interface Filter {
	label: string;
	order: Order;
}

interface Captions {
	content?: string;
}

const filters: Filter[] = [
	{
		label: "None",
		order: undefined
	},
	{
		label: "Latest",
		order: "latest"
	},
	{
		label: "Most viewed",
		order: "views"
	},
	{
		label: "Most popular",
		order: "reactions"
	}
];

function isYearValid(year?: YearData): "invalid" | "closure" | "valid" {
	if (_.isUndefined(year)) {
		return "invalid";
	}
	const date = new Date();
	if (year.openingDate <= date && date <= year.closureDate) {
		return "valid";
	}
	if (year.closureDate <= date && date <= year.finalClosureDate) {
		return "closure";
	}

	return "invalid";
}

export function IdeaPage() {
	const dispatch = useAppDispatch();
	const {
		data: ideasData,
		status: ideasStatus,
		pages: ideasPages
	} = useSelector((state: RootState) => state.ideas.getIdeas);
	const { status: ideasCreateStatus } = useSelector((state: RootState) => state.ideas.createIdea);
	const { token } = useSelector((state: RootState) => state.auth);
	const { data: yearsData, status: yearsStatus } = useSelector((state: RootState) => state.years.getYearsByName);
	const { data: categoriesData, status: categoriesStatus } = useSelector(
		(state: RootState) => state.categories.getCategoriesByName
	);
	const [page, setPage] = useState(1);
	const [form, setForm] = useState<Partial<IdeaData>>({});
	const [captions, setCaptions] = useState<Captions>({});

	const [checked, setChecked] = useState(false);
	const [filter, setFilter] = useState<Filter | undefined>(undefined);
	const [filterAnchor, setFilterAnchor] = useState<HTMLElement | undefined>(undefined);
	const [openFilter, setOpenFilter] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);

	const getIdeasPaginated = () => {
		dispatch(
			getIdeas({
				page: page - 1,
				pageLimit: 5,
				academicYear: (form.academicYear as YearData)?.id as number,
				order: filter?.order
			})
		);
	};

	const getYearsBySearch = useMemo(
		() =>
			_.throttle((name) => {
				dispatch(getYearsByName({ name }));
			}, 200),
		[]
	);

	const getCategoriesBySearch = useMemo(
		() =>
			_.throttle((name) => {
				dispatch(getCategoriesByName({ name }));
			}, 200),
		[]
	);

	const disablePostingIdea = isYearValid(form.academicYear as YearData) !== "valid";

	const mediaQueries = {
		sm: useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
	};

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(form.content)) {
			captions.content = "Please enter your idea here";
		} else if (!checked) {
			captions.content = "Please accept Terms and Conditions before posting";
		}

		setCaptions(captions);

		return _.isEmpty(captions) ? true : false;
	};

	useEffect(() => {
		getIdeasPaginated();
	}, [page, filter, form.academicYear]);

	return (
		<Grid container direction="column" px={{ xs: 0, sm: 5, md: 15 }} spacing={2}>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogContent>
					<Autocomplete
						value={_.first(form.categories as CategoryData[])}
						options={categoriesData}
						filterSelectedOptions
						autoComplete
						filterOptions={(options) => options}
						getOptionLabel={(option) => option.name}
						loading={categoriesStatus === "pending"}
						sx={{ minWidth: 200 }}
						renderInput={(params) => <StyledTextField {...params} label="Category" />}
						onChange={(e, value) => {
							setForm({
								...form,
								categories: _.isNull(value) ? undefined : [value]
							});
						}}
						onInputChange={(e, value) => {
							getCategoriesBySearch(value);
						}}
					/>
				</DialogContent>
			</Dialog>
			<Grid item width="100%" alignSelf="center">
				<Grid container spacing={2}>
					<Grid item sx={{ alignSelf: "center" }}>
						<IconButton
							disabled={_.isUndefined(form.academicYear)}
							onClick={(e) => {
								setOpenFilter(true);
								setFilterAnchor(e.currentTarget);
							}}
						>
							<FilterListRounded />
						</IconButton>
						<Menu open={openFilter} onClose={() => setOpenFilter(false)} anchorEl={filterAnchor}>
							{filters.map((filter) => (
								<MenuItem
									onClick={() => {
										setOpenFilter(false);
										setFilter(filter);
									}}
									value={filter.order}
								>
									{filter.label}
								</MenuItem>
							))}
						</Menu>
					</Grid>
					<Grid item sx={{ alignSelf: "center" }} xs={0.9}>
						<IconButton
							disabled={_.isUndefined(form.academicYear)}
							href={`${APIPaths.Ideas}/csv?academicYear=${
								(form.academicYear as YearData)?.id
							}&token=${token}`}
							download
						>
							<Badge
								badgeContent="CSV"
								anchorOrigin={{
									horizontal: "right",
									vertical: "bottom"
								}}
								sx={{
									"& .MuiBadge-badge": {
										backgroundColor: "rgb(80, 72, 229)",
										color: "white",
										right: -10,
										top: -3,
										fontSize: "0.60rem",
										border: `1px solid white`
									}
								}}
							>
								<DownloadRounded />
							</Badge>
						</IconButton>
					</Grid>
					<Grid item sx={{ alignSelf: "center" }}>
						<IconButton
							disabled={_.isUndefined(form.academicYear)}
							href={`${APIPaths.Ideas}/documents?academicYear=${
								(form.academicYear as YearData)?.id
							}&token=${token}`}
							download
						>
							<Badge
								badgeContent="DOCS"
								anchorOrigin={{
									horizontal: "right",
									vertical: "bottom"
								}}
								sx={{
									"& .MuiBadge-badge": {
										backgroundColor: "rgb(80, 72, 229)",
										color: "white",
										right: -10,
										top: -3,
										fontSize: "0.60rem",
										border: `1px solid white`
									}
								}}
							>
								<DownloadRounded />
							</Badge>
						</IconButton>
					</Grid>
					<Grid item flexGrow={1} />
					<Grid item xs={2.5}>
						<Autocomplete
							value={form.academicYear as YearData}
							options={yearsData}
							filterSelectedOptions
							autoComplete
							filterOptions={(options) => options}
							getOptionLabel={(option) => option.name}
							loading={yearsStatus === "pending"}
							renderInput={(params) => (
								<StyledTextField
									{...params}
									label="Year"
									InputProps={{
										sx: {
											height: 36,
											"& .MuiInputBase-input": {
												p: "0!important",
												height: 16
											}
										},
										...params.InputProps
									}}
								/>
							)}
							onChange={(e, value) => {
								setForm({
									...form,
									academicYear: _.isNull(value) ? undefined : (value as YearData)
								});
							}}
							onInputChange={(e, value) => {
								getYearsBySearch(value);
							}}
						/>
					</Grid>
				</Grid>
			</Grid>

			<Grid item>
				<Card
					sx={{
						minWidth: { xs: 310, sm: 450 }
					}}
				>
					<CardContent>
						<StyledTextField
							multiline
							disabled={disablePostingIdea}
							fullWidth
							error={!_.isUndefined(captions.content) ? true : false}
							helperText={captions.content}
							rows={3}
							value={form.content}
							onChange={(e) => setForm({ ...form, content: e.target.value })}
							placeholder="Please tell us your idea here..."
							InputProps={{
								sx: {
									borderRadius: 3
								}
							}}
						/>
					</CardContent>
					<CardContent sx={{ py: 0 }}>
						<Stack direction="row" spacing={1}>
							{!_.isUndefined(form.categories) &&
								(form.categories as CategoryData[]).map((cat) => (
									<Chip
										color="warning"
										sx={{
											height: 24
										}}
										onDelete={() => {
											setForm({
												...form,
												categories: undefined
											});
										}}
										label={cat.name}
									/>
								))}
							{!_.isUndefined(form.documents) &&
								form.documents.map((file) => (
									<Chip
										sx={{
											backgroundColor: "rgb(80, 72, 229)",
											color: "white",
											height: 24,
											"& .MuiSvgIcon-root": {
												fill: "white",
												"&:hover": {
													fill: "rgba(255, 255, 255, 0.8)"
												}
											}
										}}
										onDelete={() => {
											setForm({
												...form,
												documents: (form.documents as File[])?.filter((f) => f !== file)
											});
										}}
										label={file.name}
									/>
								))}
						</Stack>
					</CardContent>
					<CardActions sx={{ pr: 2 }}>
						<IconButton onClick={() => setOpenDialog(true)} disabled={disablePostingIdea} sx={{ ml: 0.1 }}>
							<LocalOfferOutlined />
						</IconButton>
						<IconButton disabled={disablePostingIdea} component="label" sx={{ ml: 1 }}>
							<AttachmentRounded />
							<input
								onChange={(e) => {
									setForm({ ...form, documents: Array.from(e.target.files ?? []) });
								}}
								type="file"
								multiple
								hidden
							/>
						</IconButton>
						<FormControlLabel
							disabled={disablePostingIdea}
							sx={{
								"& .Mui-checked": {
									color: "rgb(80, 72, 229) !important"
								}
							}}
							control={<Checkbox checked={checked} onChange={(e, checked) => setChecked(checked)} />}
							label="I agree to Terms and Conditions"
						/>
						<Box flexGrow={1} />
						<Button
							endIcon={ideasCreateStatus === "idle" ? <SendOutlined /> : undefined}
							onClick={() => {
								if (validate()) {
									dispatch(createIdea(form)).then(() => {
										setForm({ content: "", academicYear: form.academicYear });
										getIdeasPaginated();
									});
								}
							}}
							disabled={disablePostingIdea}
							variant="primary"
						>
							{ideasCreateStatus === "idle" ? (
								"Post"
							) : (
								<CircularProgress sx={{ "& .MuiCircularProgress-svg": { color: "white" } }} size={24} />
							)}
						</Button>
					</CardActions>
				</Card>
			</Grid>

			{!_.isUndefined(form.academicYear) &&
				ideasData.map((idea) => {
					return (
						<Grid item marginTop={1}>
							<Idea
								idea={idea}
								academicYear={(form.academicYear as YearData)?.id}
								disableComment={isYearValid(form.academicYear as YearData) === "invalid"}
							/>
						</Grid>
					);
				})}
			{ideasStatus === "pending" && (
				<Grid item textAlign="center" mt={3}>
					<LinearProgress />
				</Grid>
			)}
			<Grid item alignSelf="center">
				{!_.isEmpty(ideasData) && !_.isUndefined(form.academicYear) && (
					<Pagination
						size={mediaQueries.sm ? "medium" : "small"}
						count={ideasPages === 0 ? 1 : ideasPages}
						defaultPage={1}
						page={page}
						onChange={(e, p) => {
							if (ideasStatus === "idle") {
								setPage(p);
							}
						}}
					/>
				)}
			</Grid>
		</Grid>
	);
}
