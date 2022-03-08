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
	ApartmentRounded,
	PersonRounded,
	GroupRounded,
    InsertChartRounded
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
                name: "Statistics",
                icon: <InsertChartRounded/>
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
				icon: <ApartmentRounded />
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
	const [selectedCategory, setSelectedCategory] = useState(menuItems[0].header);
	const [selectedItem, setSelectedItem] = useState(menuItems[0].items[0].name);
	const mediaQueries = {
		md: useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))
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
		if (mediaQueries.md) {
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
					width: { md: `calc(100% - ${drawerWidth}px)` },
					ml: { md: `${drawerWidth}px` },
					backgroundColor: "rgba(255, 255, 255, 0.7)",
					backdropFilter: "blur(20px)",
					boxShadow: "none",
					px: 5
				}}
			>
				<Toolbar>
					<IconButton edge="start" onClick={toggleDrawer} sx={{ mr: 2, display: { md: "none" } }}>
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
			<Box width={{ md: drawerWidth }} flexShrink={{ md: 0 }}>
				<Drawer
					variant={mediaQueries.md ? "permanent" : "temporary"}
					open={mediaQueries.md ? true : openDrawer}
					onClose={toggleDrawer}
					ModalProps={{
						keepMounted: true
					}}
					PaperProps={{
						sx: {
							width: drawerWidth
							// backgroundColor: "rgb(30, 41, 58)"
							// backgroundColor: "rgb(17, 24, 39)"
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
										// backgroundColor: "rgb(17, 24, 39)"
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
													// color: "#0072E5",
													color: "rgb(80, 72, 229)",
													fontWeight: 500
												},
												".MuiSvgIcon-root": {
													fill: "rgb(80, 72, 229)"
													// fill: "#0072E5"
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
													// fill: "rgba(238, 238, 238, 0.7)"
												}
											}}
										>
											{item.icon}
										</ListItemIcon>
										<ListItemText
											primaryTypographyProps={{
												sx: {
													color: "rgba(0, 0, 0, 0.75)"
													// color: "rgba(238, 238, 238, 0.7)"
												}
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
