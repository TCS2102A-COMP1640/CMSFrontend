import { Typography } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const message = `I don't want to work this place !!!! `;

const options = ["None", "Atria", "Callisto"];

const ITEM_HEIGHT = 48;

export function IdeaPage() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ flexGrow: 1, overflow: "hidden", px: 3 }}>
			<Paper sx={{ maxWidth: 1000, my: 1, mx: "auto", p: 2, border: "1.5px solid" }}>
				<Grid container wrap="nowrap" spacing={2}>
					<Grid item>
						<Avatar>J</Avatar>
					</Grid>
					<Grid item xs>
						<Typography style={{ fontSize: 20 }}>Jonh Holland</Typography>
						<Typography style={{ fontSize: 10 }}>IT Department</Typography>
					</Grid>
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
				</Grid>
				<br />
				<Grid container wrap="nowrap" spacing={2}>
					<Grid item xs>
						<Typography>{message}</Typography>
					</Grid>
				</Grid>
				<br />
				<Grid container wrap="nowrap" spacing={2}>
					<Grid item xs>
						<Stack direction="row" spacing={2}>
							<Button variant="contained" startIcon={<ThumbUpIcon />}></Button>
							<Button variant="contained" startIcon={<ThumbDownIcon />}></Button>
							<Button variant="contained" startIcon={<CommentIcon />}>
								Comment
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
}
