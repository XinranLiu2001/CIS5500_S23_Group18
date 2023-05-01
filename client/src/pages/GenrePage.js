import { useEffect, useState } from 'react';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Footer from "../components/Footer"
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
    fetch(`http://${config.server_host}:${config.server_port}/top1000/2022/${titleType}`)
      .then(res => res.json())
      .then(resJson => setTop5type(resJson));
  }, []);

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {titleType}
        </Typography>
        <TableContainer component={Paper} >
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
            <TableRow key="table-header-row">
              <StyledTableCell key="title-header">Title</StyledTableCell>
              <StyledTableCell key="average-rating-header" align="right">Average Rating</StyledTableCell>
              <StyledTableCell key="directors-header" align="right">Directors</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {top5type.map((row) => (
                <StyledTableRow key={row.tconst}>
                  <StyledTableCell component="th" scope="row" sx={{ width: '40%' }}>
                    <Link component={NavLink} to={`/media/${row.tconst}`}>
                      {row.title}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell align="right" sx={{ width: '30%' }}>{row.averageRating}</StyledTableCell>
                  <StyledTableCell align="right" sx={{ width: '30%' }}>{row.directors}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Grid>
  );
}

export default function GenrePage() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/distinct_genres`)
      .then(res => res.json())
      .then(resJson => setGenres(resJson));
  }, []);

  return (
    <div>
      <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Trending for Different Genres
      </Typography>
      <Grid container spacing={4}>
        {genres.map((type) => {
          if (type.genre === "Action" || type.genre === "Adventure" || type.genre === "Crime") {
            return <TypeTable key={type.genre} titleType={type.genre} />;
          }
          return null;
        })}
      </Grid>
      
      </Container>
      <Footer id="footer" />
    </div>
    
  );
}
