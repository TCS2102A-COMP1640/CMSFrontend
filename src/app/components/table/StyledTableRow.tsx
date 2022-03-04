import { memo } from "react";
import { TableRow, styled } from "@mui/material";

const StyledTableRowInternal = styled(TableRow)(({ theme }) => ({
	"&:hover": {
		td: {
			backgroundColor: "rgb(244, 246, 248)"
		}
	},
	"& td:last-child": {
		paddingRight: "16px",
		paddingLeft: 0,
		borderRadius: "0px 30px 30px 0px"
	},
	"& td:first-child": {
		paddingLeft: "16px",
		paddingRight: 0,
		borderRadius: "30px 0px 0px 30px"
	},
	"& th:last-child": {
		paddingRight: "16px",
		paddingLeft: 0
	},
	"& th:first-child": {
		paddingLeft: "16px",
		paddingRight: 0
	},
	"& td": {
		borderBottom: 0,
		paddingRight: 0,
		paddingLeft: 0,
		borderRadius: "0px 1px 0px 1px",
		backgroundClip: "content-box"
	},
	"& th": {
		borderBottom: "0.5px solid rgba(224, 224, 224, 1)",
		paddingRight: 0,
		paddingLeft: 0,
		paddingBottom: 16,
		paddingTop: 16
	}
}));

export const StyledTableRow = memo(StyledTableRowInternal);
