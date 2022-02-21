import React from "react";
import { Grid } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export function CategoryPage() {
	return <Grid></Grid>;
}
// function createData(
// 	Categories: string,
// 	View: number,
// 	ThumpUp: number,
// 	Lastestdate: Date,
// 	Oldestdate: Date,
//   ) {
// 	return { Categories, View, ThumpUp, Lastestdate, Oldestdate };
//   }

//   const rows = [
// 	createData('Hot Girl', 359, 1000, 2/2/2019, 2/2/2021),
// 	createData('Hot Student', 237, 2000, 20/10/2017, 20/10/2019),
// 	createData('View School', 123, 300, 21/11/2015, 21/11/2021),
// 	createData('Teacher', 305, 200, 21/11/2015, 21/11/2021),
// 	createData('Confession', 356, 430, 1/1/2012, 1/1/2021),
//   ];

// export default function BasicTable() {
// 	return (
// 	  <TableContainer component={Paper}>
// 		<Table sx={{ minWidth: 650 }} aria-label="simple table">
// 		  <TableHead>
// 			<TableRow>
// 			  <TableCell>Dessert (100g serving)</TableCell>
// 			  <TableCell align="right">View</TableCell>
// 			  <TableCell align="right">Thump&nbsp;Up</TableCell>
// 			  <TableCell align="right">Lastest&nbsp;Date</TableCell>
// 			  <TableCell align="right">Oldest&nbsp;Date</TableCell>
// 			</TableRow>
// 		  </TableHead>
// 		  <TableBody>
// 			{rows.map((row) => (
// 			  <TableRow
// 				key={row.name}
// 				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
// 			  >
// 				<TableCell component="th" scope="row">
// 				  {row.name}
// 				</TableCell>
// 				<TableCell align="right">{row.View}</TableCell>
// 				<TableCell align="right">{row.ThumpUp}</TableCell>
// 				<TableCell align="right">{row.Lastestdate}</TableCell>
// 				<TableCell align="right">{row.Oldestdate}</TableCell>
// 			  </TableRow>
// 			))}
// 		  </TableBody>
// 		</Table>
// 	  </TableContainer>
// 	);
//   }
