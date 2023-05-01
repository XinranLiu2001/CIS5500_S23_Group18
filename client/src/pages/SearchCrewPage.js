import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, Autocomplete, Typography, FormControlLabel, FormGroup, Switch, Grid, Link, Slider, TextField, Radio, RadioGroup} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';

// TODO: https://mui.com/material-ui/react-autocomplete/#customization
const config = require('../config.json');

export default function SearchPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [profession, setProfession] = useState([]);
  const [checkedProfessions, setCheckedProfessions] = useState([]);
  const [name, setTitle] = useState('');
  const [year, setYear] = useState([1180, 2022]);
  const [isDead, setIsDead] = useState(false);

//   const toggleCheckedProfession = (t) => {
//     if (checkedProfessions.includes(t)) {
//       setCheckedProfessions(checkedProfessions.filter((_t) => _t !== t));
//     } else {
//       setCheckedProfessions([...checkedProfessions, t]);
//     }
//   };

  const handleSelectedProfessions = (event, selectedGenres) => {
    setCheckedProfessions(selectedGenres);
  };

  const handleDeadChange = (event) => {
    setIsDead(event.target.checked);
  };

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/distinct_professions`)
        .then(res => res.json())
        .then(resJson => {
            const all_gernes = resJson.map((g) => (g.profession));
            setProfession(all_gernes);
        });
    fetch(`http://${config.server_host}:${config.server_port}/search_crew`)
      .then(res => res.json())
      .then(resJson => {
        const crewWithID = resJson.map((crew) => ({ id: crew.nconst, ...crew }));
        setData(crewWithID);
      });
  }, []);

  const search = () => {
    var professionStr = '';
    if (checkedProfessions.length === 0){
        professionStr = '';
    } else {
        professionStr = checkedProfessions.join(",");
    }
    console.log('The profession is:' + professionStr);
    fetch(`http://${config.server_host}:${config.server_port}/search_crew?name=${name}` +
      `&startBirthYear=${year[0]}&endBirthYear=${year[1]}` +
      `&dead=${isDead}&professions=${professionStr}`
    )
      .then(res => res.json())
      .then(resJson => {
        const crewWithID = resJson.map((crew) => ({ id: crew.nconst, ...crew }));
        setData(crewWithID);
      });
  }

  const columns = [
    { field: 'primaryName', headerName: 'Name', width: 300, renderCell: (params) => (
        <Link component={NavLink} to={`/crew/${params.row.nconst}`} color="secondary">{params.value}</Link>
    ), flex: 1}
    // { field: 'startYear', headerName: 'Years' },
    // { field: 'runtimeMinutes', headerName: 'RuntimeMinutes' },
    // { field: 'isAdult', headerName: 'Adult' },
  ]

  return (
    <Container>
    <Typography variant ='h1' align='center'sx={{ 
        fontFamily: 'monospace',
        fontWeight: 'bold',
        padding: '20px'
      }}>
        Search Crews
    </Typography>
    <Grid container spacing={4} justifyContent="center">
        <Grid item xs={8}>
            <TextField label='Name' value={name} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%"}}/>
        </Grid>
        <Grid item xs={4}>
            <Button color="secondary" variant="contained" onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)', color: 'warning'}}>
            Search
            </Button>
        </Grid>
        <Grid item xs={12}>
            <h3>Select Up to 3 Professions</h3>
            <Autocomplete
            color="secondary"
            multiple
            limitTags={3}
            id="multiple-limit-professions"
            options={profession}
            value={checkedProfessions}
            onChange={handleSelectedProfessions}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
                <TextField color="warning" {...params} label="Profession" />
            )}
            sx={{ width: '500px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey' },
              '&:focus-within .MuiOutlinedInput-notchedOutline': { borderColor: 'yellow' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'yellow' }, }}
        />
        </Grid>
        <Grid item xs={12}>
            <p>Birth Year Range</p>
            <Slider
            color="secondary"
            value={year}
            min={1180}
            max={2022}
            step={1}
            flex={1}
            onChange={(e, newValue) => setYear(newValue)}
            valueLabelDisplay='auto'
            />
        </Grid>
        <Grid item xs={12}>
            <FormGroup>
            <FormControlLabel
                control={<Switch color="warning" onChange={handleDeadChange} checked={isDead} />}
                label="Dead"
            />
            </FormGroup>
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