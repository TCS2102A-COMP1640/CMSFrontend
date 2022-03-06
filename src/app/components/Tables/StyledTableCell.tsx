import { memo } from "react";
import { TableCell, styled } from "@mui/material";

const StyledTableCellInternal = styled(TableCell)(({ theme }) => ({ fontSize: 15 }));

export const StyledTableCell = memo(StyledTableCellInternal);
