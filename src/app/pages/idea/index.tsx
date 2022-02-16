import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Pagination, Typography, Theme, Skeleton, useMediaQuery } from "@mui/material";
import { RootState, CommentData, getIdeas, getComments, useAppDispatch } from "@app/redux";
import { Idea } from "@app/components";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const itemSkeletons: JSX.Element[] = [];

for (let i = 0; i < 5; i++) {
	itemSkeletons.push(
		<Grid item height={70}>
			<Skeleton height="100%" />
		</Grid>
	);
}

export function IdeaPage() {
	const dispatch = useAppDispatch();
	const { data: ideasData, status: ideasStatus } = useSelector((state: RootState) => state.ideas.getIdeas);
	const [page, setPage] = useState(1);
	const [postIdea, setPostIdea] = React.useState(false);
	const onClick = () => setPostIdea(!postIdea);

	const mediaQueries = {
		sm: useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
	};

	useEffect(() => {
		dispatch(getIdeas({ page: page, limit: 5 }));
	}, [page]);

	return (
		<Grid container direction="column" px={15} spacing={2}>
			<Grid item alignSelf="center">
				<Typography variant="h5">Ideas</Typography>
			</Grid>

			<Grid item>
				<Fab color="primary" aria-label="add" onClick={onClick}>
					<AddIcon />
				</Fab>
			</Grid>

			<Grid item alignSelf="center" sx={{ flexGrow: 1, display: postIdea ? "block" : "none" }}>
				<Card sx={{ maxWidth: 345 }}>
					<CardHeader
						action={
							<IconButton aria-label="settings" onClick ={onClick}>
								<CancelIcon />
							</IconButton>
						}
						title="Post idea"
					/>

					<Grid container wrap="nowrap" spacing={2} sx={{ marginLeft: 1 }}>
						<Grid item>
							<Avatar>J</Avatar>
						</Grid>
						<Grid item xs>
							<Typography style={{ fontSize: 15, marginTop: 1 }}>Jonh Holland</Typography>
						</Grid>
					</Grid>

					<TextareaAutosize
						aria-label="empty textarea"
						placeholder="Hi user, please post  idea here!"
						font-family="Helvetica,"
						style={{ width: 200, marginLeft: 20, marginRight: 20, marginTop: 20, border: "0px solid" }}
					/>
					<Grid item alignSelf="center">
						<Button
							variant="contained"
							style={{ marginBottom: 20, marginLeft: 20, marginRight: 20, marginTop: 20 }}
						>
							Post
						</Button>
					</Grid>
				</Card>
			</Grid>

			{ideasStatus === "pending"
				? itemSkeletons
				: ideasData.map((idea) => {
						return (
							<Grid item>
								<Idea
									department={idea.user.department.name}
									content={idea.content}
									defaultReaction="none"
									onReactionChange={(reaction) => {
										console.log(reaction);
									}}
									onLoadComments={(callback) => {
										callback("pending", []);
										dispatch(getComments({ ideaId: 1 })).then((data) => {
											let comments: CommentData[] = [];
											if (data.meta.requestStatus === "fulfilled") {
												comments = data.payload as CommentData[];
											}
											callback("idle", comments);
										});
									}}
								/>
							</Grid>
						);
				  })}
			<Grid item alignSelf="center">
				<Pagination
					size={mediaQueries.sm ? "medium" : "small"}
					count={3}
					defaultPage={1}
					page={page}
					onChange={(e, p) => {
						if (ideasStatus === "idle") {
							setPage(p);
						}
					}}
				/>
			</Grid>
		</Grid>
	);
}
