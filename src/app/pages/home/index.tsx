import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
	Toolbar,
	Box,
	AppBar,
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	ListItemIcon,
	ListSubheader,
	Typography,
	IconButton,
	Theme,
	useMediaQuery,
	Breadcrumbs
} from "@mui/material";
import {
	AccountBoxRounded,
	ArticleRounded,
	MenuOutlined,
	LogoutRounded,
	TagRounded,
	CalendarTodayRounded,
	CorporateFareRounded,
	PersonRounded,
	GroupRounded
} from "@mui/icons-material";
import {
	logoutFromAccount,
	RootState,
	resetAuthState,
	resetCategoriesState,
	resetDepartmentsState,
	resetIdeasState,
	resetPermissionsState,
	resetRolesState,
	resetUsersState,
	resetYearsState
} from "@app/redux";
import { isTokenExpired } from "@app/utils";
import _ from "lodash";

const drawerWidth = 230;
const menuItems = [
	{
		header: "General",
		items: [
			{
				name: "Profile",
				icon: <AccountBoxRounded />
			},
			{
				name: "Idea",
				icon: <ArticleRounded />
			}
		]
	},
	{
		header: "Management",
		items: [
			{
				name: "Category",
				icon: <TagRounded />
			},
			{
				name: "Year",
				icon: <CalendarTodayRounded />
			},
			{
				name: "Department",
				icon: <CorporateFareRounded />
			},
			{
				name: "User",
				icon: <PersonRounded />
			},
			{
				name: "Role",
				icon: <GroupRounded />
			}
		]
	}
];

export function HomePage() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { token } = useSelector((state: RootState) => state.auth);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(menuItems[1].header);
	const [selectedItem, setSelectedItem] = useState(menuItems[1].items[2].name);
	const mediaQueries = {
		sm: useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"))
	};

	const toggleDrawer = () => {
		setOpenDrawer(!openDrawer);
	};

	const resetStates = () => {
		dispatch(resetAuthState());
		dispatch(resetCategoriesState());
		dispatch(resetDepartmentsState());
		dispatch(resetIdeasState());
		dispatch(resetPermissionsState());
		dispatch(resetRolesState());
		dispatch(resetUsersState());
		dispatch(resetYearsState());
	};

	useEffect(() => {
		if (mediaQueries.sm) {
			setOpenDrawer(false);
		}
		navigate(`/${selectedItem.toLowerCase()}`);
	}, []);

	useEffect(() => {
		if (isTokenExpired(token)) {
			resetStates();
			navigate("/login");
		}
	}, [location]);

	return (
		<Box display="flex">
			<AppBar
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
					backgroundColor: "rgba(255, 255, 255, 0.7)",
					backdropFilter: "blur(20px)",
					boxShadow: "none",
					px: 5
				}}
			>
				<Toolbar>
					<IconButton edge="start" onClick={toggleDrawer} sx={{ mr: 2, display: { sm: "none" } }}>
						<MenuOutlined />
					</IconButton>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 500,
							flexGrow: 1,
							display: "block"
						}}
					>
						University Dashboard
					</Typography>
					<IconButton
						onClick={() => {
							dispatch(logoutFromAccount());
							resetStates();
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
					<br />
					{menuItems.map((list) => (
						<List
							sx={{ px: 1.3 }}
							subheader={
								<ListSubheader
									sx={{
										letterSpacing: "1px",
										lineHeight: "36px",
										color: "#555559",
										fontSize: "0.780rem",
										fontWeight: 700
									}}
								>
									{list.header.toUpperCase()}
								</ListSubheader>
							}
						>
							{list.items.map((item) => (
								<NavLink
									to={`/${item.name.toLowerCase()}`}
									style={{ textDecoration: "none", color: "unset" }}
								>
									<ListItemButton
										key={item.name}
										selected={selectedItem === item.name}
										onClick={() => {
											setSelectedCategory(list.header);
											setSelectedItem(item.name);
										}}
										sx={{
											mb: 1,
											borderRadius: 2.5,
											"&.Mui-selected": {
												backgroundColor: "rgba(0, 0, 0, 0.04)",
												"&:hover": {
													backgroundColor: "rgba(0, 0, 0, 0.04)"
												},
												".MuiTypography-root": {
													color: "#0072E5",
													fontWeight: 500
												},
												".MuiSvgIcon-root": {
													fill: "#0072E5"
												}
											}
										}}
									>
										<ListItemIcon
											sx={{
												minWidth: 30,
												mr: 1,
												".MuiSvgIcon-root": {
													width: "0.8em",
													height: "0.8em"
												}
											}}
										>
											{item.icon}
										</ListItemIcon>
										<ListItemText
											primaryTypographyProps={{
												sx: { color: "rgba(0, 0, 0, 0.75)" }
											}}
											primary={item.name}
										/>
									</ListItemButton>
								</NavLink>
							))}
						</List>
					))}
				</Drawer>
			</Box>
			<Box flexGrow={1} width={{ sm: `calc(100% - ${drawerWidth}px)` }} display="flex" flexDirection="column">
				<Toolbar />
				<Breadcrumbs sx={{ px: 8 }}>
					<Typography color="rgba(0, 0, 0, 0.6)">{selectedCategory}</Typography>
					<Typography>{selectedItem}</Typography>
				</Breadcrumbs>
				<Box px={8} py={3}>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
