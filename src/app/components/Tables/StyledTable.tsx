import React, { memo } from "react";
import { Table, TableProps } from "@mui/material";

interface StyledTableProps extends TableProps {
	overlay: "loading" | "empty" | "none";
}

function StyledTableInternal(props: StyledTableProps) {
	const { overlay, sx, children, ...tableProps } = props;
	const childrenMapped = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { overlay });
		}
		return child;
	});
	return (
		<Table
			{...tableProps}
			sx={{
				...sx,
				"& tbody": {
					...(overlay !== "none" && {
						position: "relative"
					})
				}
			}}
		>
			{childrenMapped}
		</Table>
	);
}

export const StyledTable = memo(StyledTableInternal);
