import React, { useState, useEffect, useRef } from "react";
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
	TextField,
	useMediaQuery
} from "@mui/material";
import { ThumbUp, ThumbDown, Comment, ExpandMore } from "@mui/icons-material";
import { Status } from "@app/utils";
import { CommentData } from "@app/redux";
import _ from "lodash";

type IdeaReactionTypes = "up" | "down" | "none";

export interface IdeaProps {
	department: string;
	content: string;
	defaultReaction: IdeaReactionTypes;
	onReactionChange?: (reaction: IdeaReactionTypes) => void;
	onLoadComments?: (callback: (status: Status, data: CommentData[]) => void) => void;
}

export function Idea(props: IdeaProps) {
	const { department, content, defaultReaction } = props;
	const [reaction, setReaction] = useState(defaultReaction);
	const [comments, setComments] = useState<CommentData[]>([]);
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
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Typography fontSize={18} variant={mediaQueries.sm ? "h5" : "h6"}>
					{department}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Grid container direction="column">
					<Grid item>
						<Typography variant="body1">{content}</Typography>
					</Grid>
					<br />
					<Grid item>
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
										_.invoke(props, "onLoadComments", (status: Status, comments: CommentData[]) => {
											setComments(comments);
											setLoadingComments(status === "pending" ? true : false);
										});
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
								<TextField
									onChange={(e) => setInputComment(e.target.value)}
									multiline
									fullWidth
									rows={1}
									placeholder="Write a comment"
									InputProps={{
										sx: {
											height: 30
										}
									}}
								/>
							</Grid>
							{comments.map((comment) => {
								return (
									<Grid item justifyContent="left">
										<Typography textAlign="left" variant="subtitle2" fontWeight={600}>
											{comment.user.department.name}
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

/*

					<div>
						<IconButton
							aria-label="more"
							id="long-button"
							aria-controls={open ? "long-menu" : undefined}
							aria-expanded={open ? "true" : undefined}
							aria-haspopup="true"
							onClick={handleClick}
						>
							<MoreVertIcon />
						</IconButton>
						<Menu
							id="long-menu"
							MenuListProps={{
								"aria-labelledby": "long-button"
							}}
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							PaperProps={{
								style: {
									maxHeight: ITEM_HEIGHT * 4.5,
									width: "20ch"
								}
							}}
						>
							{options.map((option) => (
								<MenuItem key={option} selected={option === "Pyxis"} onClick={handleClose}>
									{option}
								</MenuItem>
							))}
						</Menu>
					</div>
                    */
