import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, Autocomplete, Typography, FormControlLabel, FormGroup, Switch, Grid, Link, Slider, TextField, Radio, RadioGroup} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';

// TODO: https://mui.com/material-ui/react-autocomplete/#customization
const config = require('../config.json');

export default function PopularCrew() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [rating, setRating] = useState([0, 10]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/pop_people_media`)
      .then(res => res.json())
      .then(resJson => {
        const crewWithID = resJson.map((crew) => ({ id: crew.nconst, ...crew }));
        setData(crewWithID);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/pop_people_media?startRating=${rating[0]}&endRating=${rating[1]}`
    )
      .then(res => res.json())
      .then(resJson => {
        const crewWithID = resJson.map((crew) => ({ id: crew.nconst, ...crew }));
        setData(crewWithID);
      });
  }

  const columns = [
    { field: 'primaryName', headerName: 'Name', renderCell: (params) => (
        <Link component={NavLink} to={`/crew/${params.row.nconst}`} color="secondary" style={{ color: '#FFA000' }} >{params.value}</Link>
    ), flex: 1, headerClassName:'cell12',},
    { field: 'all_shows', headerName: 'Shows' , headerClassName:'cell12', flex: 1, renderCell: (params) => {
      const all_shows = params.row.all_shows;
      const all_nconst = params.row.all_nconst;
      const show_split = all_shows.split("; ");
      const nconst_split = all_nconst.split("; ");
      const links = [];
      for (let i = 0; i < show_split.length; i++) {
          const link = (
              <Link
              component={NavLink}
              to={`/media/${nconst_split[i]}`}
              color="secondary"
              style={{ color: '#FFA000' }}
              >
              {show_split[i]}
              </Link>
          );
          links.push(link);
          if (i !== show_split.length - 1) {
              links.push("\u00A0");
          }
      }
      return <>{links}</>;
    }, flex: 3},
  ]

  return (
    <Container>
    <Typography variant ='h2' align='center'sx={{ 
        fontFamily: 'monospace',
        fontWeight: 'bold',
        padding: '20px'
      }}>
        Find Popular Actor/Actress
    </Typography>
    <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
            <p>Rating Range</p>
            <Slider
            color="secondary"
            value={rating}
            min={0}
            max={10}
            step={1}
            flex={1}
            onChange={(e, newValue) => setRating(newValue)}
            valueLabelDisplay='auto'
            />
        </Grid>
        <Grid item xs={4}>
            <Button color="secondary" variant="contained" onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)', color: 'warning'}}>
                Search
            </Button>
        </Grid>
    </Grid>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}