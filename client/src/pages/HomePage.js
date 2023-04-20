import { useEffect, useState } from 'react';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
// import LazyTable from '../components/LazyTable';
const config = require('../config.json');

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function TypeTable({ titleType }) {
  const [top5type, setTop5type] = useState([{}]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/top5/2022/${titleType}`)
      .then(res => res.json())
      .then(resJson => setTop5type(resJson));
  }, []);

  return (
    <>
      <h3>{titleType}</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell align="right">Average Rating</StyledTableCell>
              <StyledTableCell align="right">Number of Votes</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {top5type.map((row) => (
              <StyledTableRow key={row.primaryTitle}>
                <StyledTableCell component="th" scope="row">{row.primaryTitle}</StyledTableCell>
                <StyledTableCell align="right">{row.averageRating}</StyledTableCell>
                <StyledTableCell align="right">{row.numVotes}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default function HomePage() {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/distinct_types`)
      .then(res => res.json())
      .then(resJson => setTypes(resJson));
  }, []);

  return (
    <Container>
      <h2>Top 5</h2>
      <Box sx={{ flexDirection: 'column' }}>
      {types.map((type) => {
        
        if (type.titleType === "tvPilot") {
          return null; // Skip rendering the table
        }
        return <TypeTable key={type.titleType} titleType={type.titleType} />;
      })}
      </Box>
    </Container>
  );
};