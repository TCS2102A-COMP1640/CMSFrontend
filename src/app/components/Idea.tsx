import React, { useState, useEffect, memo, useRef } from "react";
import {
	Typography,
	CircularProgress,
	Grid,
	Accordion,
	Stack,
	IconButton,
	AccordionSummary,
	AccordionDetails,
	Theme,
	Chip,
	useMediaQuery,
	Tooltip,
	Divider,
	Box,
	Badge
} from "@mui/material";
import {
	ThumbUp,
	ThumbDown,
	Comment,
	ExpandMore,
	SendOutlined,
	AccessTimeFilled,
	VisibilityRounded,
	ReviewsRounded
} from "@mui/icons-material";
import {
	getIdeaComments,
	CategoryData,
	getIdeaReaction,
	IdeaCommentData,
	IdeaData,
	IdeaDocumentData,
	useAppDispatch,
	IdeaReactionData,
	createIdeaComment,
	createIdeaReaction,
	createIdeaView
} from "@app/redux";
import { StyledTextField } from "@app/components";
import { format, formatDistance } from "date-fns";
import _ from "lodash";

export interface IdeaProps {
	idea: IdeaData;
	academicYear: number;
	disableComment?: boolean;
}

function IdeaInternal(props: IdeaProps) {
	const dispatch = useAppDispatch();
	const {
		idea: {
			id,
			user: { department },
			content,
			categories,
			documents,
			createTimestamp,
			viewCount,
			thumbUpCount,
			thumbDownCount
		},
		academicYear,
		disableComment
	} = props;

	const [reaction, setReaction] = useState<number>(0);
	const [comments, setComments] = useState<IdeaCommentData[]>([]);

	const isInitialMount = useRef(true);
	const [inputComment, setInputComment] = useState("");
	const [openComments, setOpenComments] = useState(false);
	const [loadingComments, setLoadingComments] = useState(false);
	const [loadingCommentCreate, setloadingCommentCreate] = useState(false);

	const mediaQueries = {
		sm: useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
	};

	const getComments = () => {
		setLoadingComments(true);
		dispatch(getIdeaComments({ id })).then((data) => {
			if (data.meta.requestStatus === "fulfilled") {
				setComments(data.payload as IdeaCommentData[]);
			}
			setLoadingComments(false);
		});
	};

	const getReaction = () => {
		dispatch(getIdeaReaction({ id })).then((data) => {
			if (data.meta.requestStatus === "fulfilled") {
				setReaction((data.payload as IdeaReactionData).type);
			}
		});
	};

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			getReaction();
		} else {
			dispatch(createIdeaReaction({ id, type: reaction }));
		}
	}, [reaction]);

	return (
		<Accordion
			onChange={(e, expanded) => {
				if (expanded) {
					dispatch(createIdeaView({ id }));
				}
			}}
		>
			<AccordionSummary
				sx={{
					"& .MuiAccordionSummary-content": {
						flexDirection: "column"
					}
				}}
				expandIcon={<ExpandMore />}
			>
				<Typography display="block" fontSize={18} variant={mediaQueries.sm ? "h5" : "h6"}>
					{department?.name ?? "Unassigned"}
				</Typography>
				<Typography color="gray" variant="caption">
					<Tooltip title={format(createTimestamp as Date, "dd/MM/yyyy hh:mm:ss")}>
						<AccessTimeFilled sx={{ width: 16, height: 16, verticalAlign: "sub", pr: 0.7 }} />
					</Tooltip>
					{formatDistance(createTimestamp as Date, new Date(), { addSuffix: true })}
				</Typography>
				<Typography color="gray" variant="caption">
					<VisibilityRounded sx={{ width: 16, height: 16, verticalAlign: "text-bottom", pr: 0.7 }} />
					{viewCount} view{viewCount > 1 ? "s" : ""}
				</Typography>
				<Typography color="gray" variant="caption">
					<ReviewsRounded sx={{ width: 16, height: 16, verticalAlign: "text-bottom", pr: 0.7 }} />
					{thumbUpCount + thumbDownCount} reaction{thumbUpCount + thumbDownCount > 1 ? "s" : ""}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Grid container direction="column">
					<Grid item>
						<Typography variant="body1">{content}</Typography>
					</Grid>
					<br />
					<Grid item>
						{!_.isEmpty(categories) && (
							<Stack direction="row" spacing={2}>
								{categories.map((category) => (
									<Chip sx={{ height: 18 }} color="warning" label={(category as CategoryData).name} />
								))}
							</Stack>
						)}
						{!_.isEmpty(categories) && <br />}
						{!_.isEmpty(documents) && (
							<Stack direction="row" spacing={2}>
								{(documents as IdeaDocumentData[]).map((document) => (
									<Tooltip title={document.name}>
										<Chip
											sx={{
												height: 18,
												maxWidth: 120,
												backgroundColor: "rgb(80, 72, 229)",
												color: "white",
												"& .MuiSvgIcon-root": {
													fill: "white",
													"&:hover": {
														fill: "rgba(255, 255, 255, 0.8)"
													}
												}
											}}
											label={document.name}
										/>
									</Tooltip>
								))}
							</Stack>
						)}
						{!_.isEmpty(documents) && <br />}
						<Stack direction="row" spacing={2}>
							<IconButton
								onClick={() => {
									setReaction(reaction === 1 ? 0 : 1);
								}}
								disabled={disableComment}
							>
								<ThumbUp color={reaction === 1 ? "primary" : "action"} />
							</IconButton>
							<IconButton
								onClick={() => {
									setReaction(reaction === 2 ? 0 : 2);
								}}
								disabled={disableComment}
							>
								<ThumbDown color={reaction === 2 ? "primary" : "action"} />
							</IconButton>
							<IconButton
								onClick={() => {
									if (!openComments) {
										getComments();
									}
									setOpenComments(!openComments);
								}}
							>
								<Badge
									anchorOrigin={{
										horizontal: "right",
										vertical: "bottom"
									}}
									invisible={openComments && loadingComments ? false : true}
									sx={{
										"& .MuiBadge-badge": {
											backgroundColor: "white",
											boxShadow:
												"rgba(145, 158, 171, 0.8) 0px 0px 3px 0px, rgba(145, 158, 171, 0.8) 0px 12px 24px -4px",
											top: -3,
											p: 0
										}
									}}
									badgeContent={
										<CircularProgress
											sx={{
												"& .MuiCircularProgress-svg": {
													color: "rgb(80, 72, 229)"
												}
											}}
											size={12}
										/>
									}
								>
									<Comment color={openComments ? "primary" : "action"} />
								</Badge>
							</IconButton>
						</Stack>
					</Grid>
					<Grid item alignSelf="left" display={openComments ? "block" : "none"}>
						<Grid container spacing={2} flexDirection="column">
							<Grid item>
								<br />
								<Divider />
								<br />
							</Grid>
							<Grid item xs>
								<Grid container direction="row">
									<Grid item xs={11}>
										<StyledTextField
											fullWidth
											value={inputComment}
											onChange={(e) => setInputComment(e.target.value)}
											multiline
											rows={1}
											disabled={disableComment}
											placeholder="Write a comment"
											InputProps={{
												sx: {
													borderRadius: 4,
													height: 36
												}
											}}
										/>
									</Grid>
									<Grid item xs={1}>
										<IconButton
											sx={{ ml: 0.8 }}
											onClick={() => {
												if (!_.isEmpty(inputComment)) {
													setloadingCommentCreate(true);
													dispatch(
														createIdeaComment({ id, academicYear, content: inputComment })
													).then(() => {
														setInputComment("");
														getComments();
														setloadingCommentCreate(false);
													});
												}
											}}
											size="small"
											disabled={disableComment}
										>
											{!loadingCommentCreate ? (
												<SendOutlined color="primary" />
											) : (
												<CircularProgress
													sx={{
														"& .MuiCircularProgress-svg": {
															color: "rgb(80, 72, 229)"
														}
													}}
													size={24}
												/>
											)}
										</IconButton>
									</Grid>
								</Grid>
							</Grid>
							<Grid item></Grid>
							{comments.map((comment) => {
								return (
									<Grid
										item
										justifyContent="left"
										sx={{
											backgroundColor: "rgb(249, 250, 252)",
											borderRadius: 3,
											my: 1,
											mx: 3,
											px: 2,
											py: 1
										}}
									>
										<Box display="flex">
											<Typography textAlign="left" variant="subtitle2" fontWeight={600}>
												{comment.user.department?.name ?? "Unassigned"}
											</Typography>
											<Box flexGrow={1} />
											<Typography color="gray" variant="caption">
												{formatDistance(comment.createTimestamp as Date, new Date(), {
													addSuffix: true
												})}
											</Typography>
										</Box>
										<Typography fontSize={15} textAlign="left" variant="body2">
											{comment.content}
										</Typography>
									</Grid>
								);
							})}
							{!_.isEmpty(comments) && (
								<Grid item>
									<br />
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
}

export const Idea = memo(IdeaInternal);
