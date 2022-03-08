import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Doughnut, Bar, PolarArea } from "react-chartjs-2";
import { Box, Card, CardContent, CardHeader, Grid, Divider, Typography, CardProps, Autocomplete } from "@mui/material";
import {
	getIdeasStatistics,
	useAppDispatch,
	IdeasStatisticsData,
	YearData,
	getYearsByName,
	RootState
} from "@app/redux";
import { StyledTextField } from "@app/components";
import { stringToColor } from "@app/utils";
import _ from "lodash";
import { TooltipItem } from "chart.js";

function ShadowedCard(props: CardProps) {
	return (
		<Card
			sx={{
				boxShadow: "rgba(145, 158, 171, 0.1) 0px 0px 3px 0px, rgba(145, 158, 171, 0.2) 0px 12px 24px -4px",
				...props.sx
			}}
			{..._.omit(props, "sx")}
		/>
	);
}

export function StatisticsPage() {
	const dispatch = useAppDispatch();
	const [data, setData] = useState<IdeasStatisticsData>({});
	const [year, setYear] = useState<YearData | undefined>(undefined);
	const { data: yearsData, status: yearsStatus } = useSelector((state: RootState) => state.years.getYearsByName);

	const getYearsBySearch = useMemo(
		() =>
			_.throttle((name) => {
				dispatch(getYearsByName({ name }));
			}, 200),
		[]
	);
	useEffect(() => {
		if (!_.isUndefined(year)) {
			dispatch(getIdeasStatistics({ academicYear: year.id })).then((d) => {
				if (d.meta.requestStatus === "fulfilled") {
					setData(d.payload as IdeasStatisticsData);
				}
			});
		}
	}, [year]);

	return (
		<Box>
			<Grid container direction="row" spacing={2}>
				<Grid item xs={9} />
				<Grid item xs={3}>
					<Autocomplete
						value={year}
						options={yearsData}
						filterSelectedOptions
						autoComplete
						filterOptions={(options) => options}
						getOptionLabel={(option) => option.name}
						loading={yearsStatus === "pending"}
						renderInput={(params) => (
							<StyledTextField
								{...params}
								label="Year"
								InputProps={{
									sx: {
										height: 36,
										"& .MuiInputBase-input": {
											p: "0!important",
											height: 16
										}
									},
									...params.InputProps
								}}
							/>
						)}
						onChange={(e, value) => {
							setYear(_.isNull(value) ? undefined : (value as YearData));
						}}
						onInputChange={(e, value) => {
							getYearsBySearch(value);
						}}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<ShadowedCard>
						<CardHeader title={<Typography>Contributors by department</Typography>} />
						<Divider />
						<CardContent sx={{ position: "relative", height: 200 }}>
							<PolarArea
								data={{
									datasets: [
										{
											backgroundColor: _.map(
												data,
												(v, k) => stringToColor(k).substring(0, 7) + "99"
											),
											borderColor: _.map(data, (v, k) => stringToColor(k)),
											data: _.map(data, (v, k) => v.contributors)
										}
									]
								}}
								options={{
									maintainAspectRatio: false,
									scales: {
										r: {
											ticks: {
												stepSize: 1
											}
										}
									},
									plugins: {
										tooltip: {
											callbacks: {
												label: function (item: TooltipItem<"polarArea">) {
													return ` ${item.raw} contributors`;
												}
											}
										},
										legend: {
											title: {
												display: true,
												text: "Contributors by department",
												font: {
													family: "Roboto"
												}
											}
										}
									}
								}}
							/>
						</CardContent>
					</ShadowedCard>
				</Grid>
				<Grid item xs={12} sm={3} display="flex">
					<ShadowedCard sx={{ alignSelf: "center", flexGrow: 1 }}>
						<CardContent>
							<Typography variant="h6" fontSize={12} color="rgb(101, 116, 139)">
								ANONYMOUS IDEAS
							</Typography>
							<Typography variant="h4">
								{_.reduce(data, (sum, v) => sum + v.anonymousIdeas, 0)}
							</Typography>
						</CardContent>
					</ShadowedCard>
				</Grid>
				<Grid item xs={12} sm={3}>
					<Grid container spacing={2} height="100%" alignItems="center">
						<Grid item xs={12}>
							<ShadowedCard>
								<CardContent>
									<Typography variant="h6" fontSize={12} color="rgb(101, 116, 139)">
										ANONYMOUS COMMENTS
									</Typography>
									<Typography variant="h4">
										{_.reduce(data, (sum, v) => sum + v.anonymousComments, 0)}
									</Typography>
								</CardContent>
							</ShadowedCard>
						</Grid>
						<Grid item xs={12}>
							<ShadowedCard>
								<CardContent>
									<Typography variant="h6" fontSize={12} color="rgb(101, 116, 139)">
										IDEAS WITHOUT A COMMENT
									</Typography>
									<Typography variant="h4">
										{_.reduce(data, (sum, v) => sum + v.ideasWithoutComment, 0)}
									</Typography>
								</CardContent>
							</ShadowedCard>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} sm={6}>
					<ShadowedCard>
						<CardHeader title={<Typography>Ideas by department</Typography>} />
						<Divider />
						<CardContent sx={{ position: "relative", p: 5, height: 300 }}>
							<Bar
								data={{
									labels: [""],
									datasets: _.map(data, (v, k) => {
										return {
											label: k,
											data: [v.total],
											backgroundColor: stringToColor(k).substring(0, 7) + "99",
											borderColor: stringToColor(k),
											borderWidth: 2
										};
									})
								}}
								options={{
									maintainAspectRatio: false,
									scales: {
										y: {
											ticks: {
												stepSize: 1
											}
										}
									},
									plugins: {
										tooltip: {
											callbacks: {
												label: function (item: TooltipItem<"bar">) {
													return ` ${item.raw} ideas`;
												}
											}
										},
										legend: {
											labels: {
												font: {
													family: "Roboto"
												}
											}
										}
									}
								}}
							/>
						</CardContent>
					</ShadowedCard>
				</Grid>
				<Grid item xs={12} sm={6} position="relative">
					<ShadowedCard>
						<CardHeader title={<Typography>Idea percentage by department</Typography>} />
						<Divider />
						<CardContent sx={{ position: "relative", p: 5, height: 300 }}>
							<Doughnut
								data={{
									datasets: [
										{
											backgroundColor: _.map(
												data,
												(v, k) => stringToColor(k).substring(0, 7) + "99"
											),
											borderColor: _.map(data, (v, k) => stringToColor(k)),
											data: _.map(data, (v, k) => v.percentage * 100)
										}
									]
								}}
								options={{
									maintainAspectRatio: false,
									plugins: {
										tooltip: {
											callbacks: {
												label: function (item: TooltipItem<"doughnut">) {
													return ` ${item.raw}%`;
												}
											}
										},
										legend: {
											title: {
												display: true,
												text: "Idea percentage by department",
												font: {
													family: "Roboto"
												}
											}
										}
									}
								}}
							/>
						</CardContent>
					</ShadowedCard>
				</Grid>
			</Grid>
		</Box>
	);
}
