import React, { useState, useEffect, useRef, memo } from "react";
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
import { Status } from "@app/utils";
import { CategoryData, IdeaCommentData, IdeaDocumentData } from "@app/redux";
import { format } from "date-fns";
import _ from "lodash";

type IdeaReactionTypes = "up" | "down" | "none";

export interface IdeaProps {
	department: string;
	content: string;
	categories: CategoryData[];
	documents: IdeaDocumentData[];
	createTimestamp: Date;
	defaultReaction: IdeaReactionTypes;
	disableComment?: boolean;
	onReactionChange?: (reaction: IdeaReactionTypes) => void;
	onLoadComments?: (callback: (status: Status, data: IdeaCommentData[]) => void) => void;
	onSubmitComment?: (comment: string) => void;
}

function IdeaInternal(props: IdeaProps) {
	const { department, content, categories, documents, disableComment, createTimestamp, defaultReaction } = props;
	const [reaction, setReaction] = useState(defaultReaction);
	const [comments, setComments] = useState<IdeaCommentData[]>([]);
	const [inputComment, setInputComment] = useState("");
	const [openComments, setOpenComments] = useState(false);
	const [loadingComments, setLoadingComments] = useState(false);
	const isInitialMount = useRef(true);
	const mediaQueries = {
		sm: useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
	};

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			_.invoke(props, "onReactionChange", reaction);
		}
	}, [reaction]);

	return (
		<Accordion>
			<AccordionSummary
				sx={{
					"& .MuiAccordionSummary-content": {
						flexDirection: "column"
					}
				}}
				expandIcon={<ExpandMore />}
			>
				<Typography display="block" fontSize={18} variant={mediaQueries.sm ? "h5" : "h6"}>
					{department}
				</Typography>
				<Typography color="gray" variant="caption">
					{format(createTimestamp, "dd/MM/yyyy hh:mm:ss")}
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
									<Chip sx={{ height: 24 }} label={category.name} />
								))}
							</Stack>
						)}
						{!_.isEmpty(categories) && <br />}
						{!_.isEmpty(documents) && (
							<Stack direction="row" spacing={2}>
								{documents.map((document) => (
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
									setReaction(reaction === "up" ? "none" : "up");
								}}
							>
								<ThumbUp color={reaction === "up" ? "primary" : "inherit"} />
							</IconButton>
							<IconButton
								onClick={() => {
									setReaction(reaction === "down" ? "none" : "down");
								}}
							>
								<ThumbDown color={reaction === "down" ? "primary" : "inherit"} />
							</IconButton>
							<IconButton
								onClick={() => {
									if (!openComments) {
										_.invoke(
											props,
											"onLoadComments",
											(status: Status, comments: IdeaCommentData[]) => {
												setComments(comments);
												setLoadingComments(status === "pending" ? true : false);
											}
										);
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
											_.invoke(props, "onSubmitComment", inputComment);
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
											{comment.user.department?.name ?? "Unknown"}
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
