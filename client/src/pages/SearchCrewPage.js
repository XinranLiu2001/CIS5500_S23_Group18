import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, Typography, FormControlLabel, FormGroup, Switch, Grid, Link, Slider, TextField, Radio, RadioGroup} from '@mui/material';
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
  const [year, setYear] = useState([1888, 2030]);
  const [isDead, setIsDead] = useState(false);
  
  // const toggleCheckedType = (t) => {
  //   if (checkedTypes.includes(t)) {
  //     setCheckedTypes(checkedTypes.filter((_t) => _t !== t));
  //   } else {
  //     setCheckedTypes([t]);
  //   }
  // };

  const toggleCheckedProfession = (t) => {
    if (checkedProfessions.includes(t)) {
      setCheckedProfessions(checkedProfessions.filter((_t) => _t !== t));
    } else {
      setCheckedProfessions([...checkedProfessions, t]);
    }
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
    const professionStr = checkedProfessions.join(",");
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
        <Link component={NavLink} to={`/crew/${params.row.nconst}`}>{params.value}</Link>
    ), flex: 1}
    // { field: 'startYear', headerName: 'Years' },
    // { field: 'runtimeMinutes', headerName: 'RuntimeMinutes' },
    // { field: 'isAdult', headerName: 'Adult' },
  ]

  return (
    <Container>
      {/* {selectedCrewId && <MediaPage mediaId={selectedCrewId} handleClose={() => setSelectedCrewId(null)} />} */}
    <Typography variant ='h1' align='center'sx={{ 
        color: 'secondary',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        padding: '20px'
      }}>
        Search Crews
    </Typography>
      <Grid container spacing={6}>
        <Grid item xs={8}>
            <TextField label='Name' value={name} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
        <FormGroup>
            <FormControlLabel
                control={<Switch color="warning" onChange={handleDeadChange} checked={isDead} />}
                label="Dead"
            />
        </FormGroup>
        </Grid>
        <h3>Profession</h3>
        <Grid container spacing = {2}>
        {profession.map((g) => (
            <Grid item key={g} xs={2}>
                <FormControlLabel
                label={g.replaceAll('_', ' ')}
                control={<Checkbox checked={checkedProfessions.includes(g)} onChange={() => toggleCheckedProfession(g)} />}
                />
            </Grid>
            ))}
        </Grid>

        <Grid item xs={6}>
          <p>Year range</p>
          <Slider
            value={year}
            min={1888}
            max={2030}
            step={1}
            onChange={(e, newValue) => setYear(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
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