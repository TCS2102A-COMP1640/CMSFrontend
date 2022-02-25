import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
	Grid,
	Pagination,
	Typography,
	Theme,
	Skeleton,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Button,
	TextField,
	Modal,
	useMediaQuery,
	Select,
	MenuItem,
	Chip,
	Box,
	InputLabel,
	FormControl,
	Divider
} from "@mui/material";
import { SendOutlined, CancelOutlined } from "@mui/icons-material";
import {
	RootState,
	IdeaData,
	CategoryData,
	getIdeas,
	useAppDispatch,
	getYears,
	createIdea,
	getCategories,
	IdeaDocumentData,
	createIdeaComment
} from "@app/redux";
import { Idea } from "@app/components";
import _ from "lodash";

const itemSkeletons: JSX.Element[] = [];

for (let i = 0; i < 5; i++) {
	itemSkeletons.push(
		<Grid item height={70}>
			<Skeleton height="100%" />
		</Grid>
	);
}

interface Captions {
	content?: string;
}

export function IdeaPage() {
	const dispatch = useAppDispatch();
	const {
		data: ideasData,
		status: ideasStatus,
		pages: ideasPages
	} = useSelector((state: RootState) => state.ideas.getIdeas);
	const { data: yearsData } = useSelector((state: RootState) => state.years.getYears);
	const { data: categoriesData } = useSelector((state: RootState) => state.categories.getCategories);
	const [page, setPage] = useState(1);
	const [openModal, setOpenModal] = useState(false);
	const [formModal, setFormModal] = useState<Partial<IdeaData>>({});
	const [captionsModal, setCaptionsModal] = useState<Captions>({});

	const mediaQueries = {
		sm: useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
	};

	const validate = () => {
		const captions: Captions = {};

		if (_.isEmpty(formModal.content)) {
			captions.content = "Please enter your idea here";
		}

		setCaptionsModal(captions);

		return _.isEmpty(captions) ? true : false;
	};

	useEffect(() => {
		dispatch(getYears());
		dispatch(getCategories());
	}, []);

	useEffect(() => {
		dispatch(
			getIdeas({
				page: page - 1,
				pageLimit: itemSkeletons.length,
				academicYear: formModal.academicYear as number
			})
		);
	}, [page, formModal.academicYear]);

	return (
		<Grid container direction="column" px={{ xs: 0, sm: 5, md: 15 }} spacing={2}>
			<Modal
				open={openModal}
				onClose={() => {
					setOpenModal(false);
					setCaptionsModal({});
				}}
			>
				<Card
					sx={{
						minWidth: { xs: 310, sm: 450 },
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)"
					}}
				>
					<CardHeader sx={{ textAlign: "center", p: 1 }} title="Create idea" />
					<Divider />
					<CardContent>
						<TextField
							multiline
							fullWidth
							error={!_.isUndefined(captionsModal.content) ? true : false}
							helperText={captionsModal.content}
							rows={4}
							value={formModal.content}
							onChange={(e) => setFormModal({ ...formModal, content: e.target.value })}
							placeholder="Please tell us your idea here..."
						/>
						<FormControl sx={{ minWidth: 110, mt: 2 }}>
							<InputLabel
								id="select-category-label"
								sx={{
									top: _.isEmpty(formModal.categories) ? -9 : 0,
									"&.Mui-focused": {
										top: 0
									}
								}}
							>
								Category
							</InputLabel>
							<Select
								labelId="select-category-label"
								label="Category"
								value={
									_.isEmpty(formModal.categories)
										? ""
										: _.toString(_.first(formModal.categories as number[]))
								}
								onChange={(e) => {
									setFormModal({ ...formModal, categories: [_.toInteger(e.target.value)] });
								}}
								renderValue={(value: string) => {
									return (
										<Chip
											sx={{ height: 24 }}
											label={_.toString(
												_.find(categoriesData, (data) => value === _.toString(data.id))?.name
											)}
											onDelete={() => {}}
											deleteIcon={
												<Box
													display="flex"
													onMouseDown={(e) => {
														e.stopPropagation();
														setFormModal({ ...formModal, categories: [] });
													}}
												>
													<CancelOutlined fontSize="small" />
												</Box>
											}
										/>
									);
								}}
								sx={{
									height: 36
								}}
							>
								{categoriesData.map((data) => {
									return (
										<MenuItem key={data.id} value={_.toString(data.id)}>
											{data.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
						<Button variant="outlined" component="label" sx={{ mt: 2, ml: 1 }}>
							Upload documents
							<input
								onChange={(e) => {
									setFormModal({ ...formModal, documents: e.target.files as FileList });
								}}
								type="file"
								multiple
								hidden
							/>
						</Button>
					</CardContent>
					<CardActions>
						<Button
							fullWidth
							endIcon={<SendOutlined />}
							onClick={() => {
								if (validate()) {
									dispatch(createIdea(formModal)).then(() => {
										dispatch(
											getIdeas({
												page: page - 1,
												pageLimit: itemSkeletons.length,
												academicYear: formModal.academicYear as number
											})
										);
									});
									setOpenModal(false);
								}
							}}
						>
							Post
						</Button>
					</CardActions>
				</Card>
			</Modal>
			<Grid item alignSelf="center">
				<Typography variant="h5">Ideas</Typography>
			</Grid>

			<Grid item width="100%" alignSelf="center">
				<Grid container spacing={2}>
					<Grid item>
						<FormControl sx={{ minWidth: 80 }}>
							<InputLabel
								id="select-year-label"
								sx={{
									top: _.isUndefined(formModal.academicYear) ? -9 : 0,
									"&.Mui-focused": {
										top: 0
									}
								}}
							>
								Year
							</InputLabel>
							<Select
								labelId="select-year-label"
								value={formModal.academicYear}
								label="Year"
								onChange={(e) => setFormModal({ ...formModal, academicYear: e.target.value as number })}
								sx={{
									height: 36
								}}
							>
								{yearsData.map((year) => {
									return (
										<MenuItem key={year.id} value={year.id}>
											{year.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</Grid>
					<Grid item flexGrow={1}></Grid>
					<Grid item>
						<Button
							variant="outlined"
							disabled={
								_.isUndefined(formModal.academicYear)
									? true
									: (() => {
											const year = _.find(
												yearsData,
												(year) => year.id === (formModal.academicYear as number)
											);
											if (!_.isUndefined(year)) {
												const date = new Date();
												if (year.openingDate <= date && date <= year.closureDate) {
													return false;
												}
											}

											return true;
									  })()
							}
							endIcon={<SendOutlined />}
							onClick={() => setOpenModal(true)}
						>
							Create an idea
						</Button>
					</Grid>
				</Grid>
			</Grid>

			{ideasStatus === "pending" ? (
				itemSkeletons
			) : !_.isEmpty(ideasData) ? (
				ideasData.map((idea) => {
					return (
						<Grid item>
							<Idea
								department={idea.user.department?.name || "Unknown"}
								content={idea.content}
								categories={idea.categories as CategoryData[]}
								documents={idea.documents as IdeaDocumentData[]}
								createTimestamp={idea.createTimestamp as Date}
								defaultReaction="none"
								disableComment={
									_.isUndefined(formModal.academicYear)
										? true
										: (() => {
												const year = _.find(
													yearsData,
													(year) => year.id === (formModal.academicYear as number)
												);
												if (!_.isUndefined(year)) {
													const date = new Date();
													if (year.openingDate <= date && date <= year.finalClosureDate) {
														return false;
													}
												}

												return true;
										  })()
								}
								onReactionChange={(reaction) => {
									console.log(reaction);
								}}
								onLoadComments={(callback) => {
									callback("idle", idea.comments);
								}}
								onSubmitComment={(comment) => {
									dispatch(createIdeaComment({ ideaId: idea.id, content: comment }));
								}}
							/>
						</Grid>
					);
				})
			) : (
				<Grid item>
					<Typography>
						{_.isUndefined(formModal.academicYear)
							? "Please select a year"
							: "There were no ideas submitted for this year..."}
					</Typography>
				</Grid>
			)}
			<Grid item alignSelf="center">
				{!_.isEmpty(ideasData) && (
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
