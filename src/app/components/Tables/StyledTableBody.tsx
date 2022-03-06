import React, { memo } from "react";
import { Box, CircularProgress, TableBody, TableRow, TableCell, TableBodyProps, Typography } from "@mui/material";
import { TableCellMapper } from "@app/utils";
import { InboxOutlined } from "@mui/icons-material";
import _ from "lodash";

interface StyledTableBodyProps extends TableBodyProps {
	overlay?: "loading" | "empty" | "none";
	tableCellMappers: TableCellMapper<any>[];
}

function StyledTableBodyInternal(props: StyledTableBodyProps) {
	const { children, overlay, tableCellMappers, ...bodyProps } = props;

	return (
		<TableBody {...bodyProps}>
			{overlay !== "none"
				? _.range(0, 5).map((i) => {
						return (
							<TableRow key={i}>
								{tableCellMappers.map((mapper) => {
									return (
										<TableCell height="45px" width={mapper.width} align={mapper.align}>
											{i}
										</TableCell>
									);
								})}
							</TableRow>
						);
				  })
				: children}
			<Box
				display={overlay === "none" ? "none" : "flex"}
				position="absolute"
				top={0}
				left={0}
				right={0}
				bottom={0}
				sx={{
					backgroundColor: "white"
				}}
				alignItems="center"
				justifyContent="center"
			>
				{overlay === "loading" ? (
					<CircularProgress />
				) : (
					<Box display="flex" flexDirection="column" alignItems="center">
						<InboxOutlined sx={{ width: 60, height: 60 }} />
						<Typography variant="h6" textAlign="center">
							No data
						</Typography>
					</Box>
				)}
			</Box>
		</TableBody>
	);
}

export const StyledTableBody = memo(StyledTableBodyInternal);
