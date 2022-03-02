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
	TextField,
	useMediaQuery,
	Tooltip
} from "@mui/material";
import { ThumbUp, ThumbDown, Comment, ExpandMore, SendOutlined } from "@mui/icons-material";
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
import { format } from "date-fns";
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
			createTimestamp
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
			dispatch(createIdeaReaction({ id, type: reaction })).then(getReaction);
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
					{format(createTimestamp as Date, "dd/MM/yyyy hh:mm:ss")}
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
									<Chip sx={{ height: 24 }} label={(category as CategoryData).name} />
								))}
							</Stack>
						)}
						{!_.isEmpty(categories) && <br />}
						{!_.isEmpty(documents) && (
							<Stack direction="row" spacing={2}>
								{(documents as IdeaDocumentData[]).map((document) => (
									<Tooltip title={document.name}>
										<Chip clickable sx={{ height: 24, maxWidth: 120 }} label={document.name} />
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
							>
								<ThumbUp color={reaction === 1 ? "primary" : "inherit"} />
							</IconButton>
							<IconButton
								onClick={() => {
									setReaction(reaction === 2 ? 0 : 2);
								}}
							>
								<ThumbDown color={reaction === 2 ? "primary" : "inherit"} />
							</IconButton>
							<IconButton
								onClick={() => {
									if (!openComments) {
										getComments();
									}
									setOpenComments(!openComments);
								}}
							>
								<Comment color={openComments ? "primary" : "inherit"} />
							</IconButton>
						</Stack>
					</Grid>
					<Grid item alignSelf="center" display={openComments && loadingComments ? "block" : "none"}>
						<CircularProgress size={24} />
					</Grid>
					<Grid item alignSelf="left" display={openComments && !loadingComments ? "block" : "none"}>
						<Grid container spacing={2} flexDirection="column">
							<Grid item xs>
								<Stack direction="row">
									<TextField
										onChange={(e) => setInputComment(e.target.value)}
										multiline
										rows={1}
										disabled={disableComment}
										placeholder="Write a comment"
										sx={{
											flexGrow: 1
										}}
										InputProps={{
											sx: {
												height: 23
											}
										}}
									/>
									<IconButton
										disabled={disableComment}
										sx={{ height: 33, width: 33 }}
										onClick={() => {
											dispatch(
												createIdeaComment({ id, academicYear, content: inputComment })
											).then(getComments);
										}}
									>
										<SendOutlined fontSize="small" />
									</IconButton>
								</Stack>
							</Grid>
							{comments.map((comment) => {
								return (
									<Grid item justifyContent="left">
										<Typography textAlign="left" variant="subtitle2" fontWeight={600}>
											{comment.user.department?.name ?? "Unassigned"}
										</Typography>
										<Typography textAlign="left" variant="body2">
											{comment.content}
										</Typography>
									</Grid>
								);
							})}
						</Grid>
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
}

export const Idea = memo(IdeaInternal);
