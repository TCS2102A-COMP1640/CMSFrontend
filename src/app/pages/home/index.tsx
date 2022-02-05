import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
	Toolbar,
	Box,
	AppBar,
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	ListItemIcon,
	Typography,
	IconButton,
	useMediaQuery,
	Theme
} from "@mui/material";
import { AccountBoxOutlined, ArticleOutlined, MenuOutlined, LogoutRounded } from "@mui/icons-material";
import { logoutFromAccount } from "@app/redux";
import _ from "lodash";

const drawerWidth = 180;
const menuItems = [
	{
		name: "Profile",
		icon: <AccountBoxOutlined />
	},
	{
		name: "Idea",
		icon: <ArticleOutlined />
	}
];

export function HomePage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [openDrawer, setOpenDrawer] = useState(false);
	const [selectedItem, setSelectedItem] = useState(menuItems[0].name);
	const mediaQueries = {
		sm: useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
	};

	const toggleDrawer = () => {
		setOpenDrawer(!openDrawer);
	};

	useEffect(() => {
		if (mediaQueries.sm) {
			setOpenDrawer(false);
		}
	});

	return (
		<Box display="flex">
			<AppBar
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
					backgroundColor: "transparent"
				}}
			>
				<Toolbar>
					<IconButton edge="start" onClick={toggleDrawer} sx={{ mr: 2, display: { sm: "none" } }}>
						<MenuOutlined />
					</IconButton>
					<Typography
						variant="h6"
						sx={{
							flexGrow: 1,
							display: {
								xs: "none",
								sm: "block"
							},
							color: "black"
						}}
					>
						University
					</Typography>
					<IconButton
						onClick={() => {
							dispatch(logoutFromAccount());
							navigate("/login");
						}}
					>
						<LogoutRounded />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Box width={{ sm: drawerWidth }} flexShrink={{ sm: 0 }}>
				<Drawer
					variant={mediaQueries.sm ? "permanent" : "temporary"}
					open={mediaQueries.sm ? true : openDrawer}
					onClose={toggleDrawer}
					ModalProps={{
						keepMounted: true
					}}
					PaperProps={{
						sx: {
							width: drawerWidth
						}
					}}
				>
					<List>
						{menuItems.map((item) => (
							<NavLink
								to={`/${item.name.toLowerCase()}`}
								style={{ textDecoration: "none", color: "unset" }}
							>
								<ListItemButton
									key={item.name}
									selected={selectedItem === item.name}
									onClick={() => {
										setSelectedItem(item.name);
									}}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.name} />
								</ListItemButton>
							</NavLink>
						))}
					</List>
				</Drawer>
			</Box>
			<Box flexGrow={1} width={{ sm: `calc(100% - ${drawerWidth}px)` }} display="flex" flexDirection="column">
				<Toolbar />
				<Box padding={3}>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
