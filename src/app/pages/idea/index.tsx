import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Pagination, Typography, Theme, Skeleton, useMediaQuery } from "@mui/material";
import { RootState, CommentData, getIdeas, getComments, useAppDispatch } from "@app/redux";
import { Idea } from "@app/components";

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
