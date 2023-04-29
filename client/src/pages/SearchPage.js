import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, Typography, FormControlLabel, Grid, Link, Slider, TextField, Radio, RadioGroup} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';

// TODO: https://mui.com/material-ui/react-autocomplete/#customization
const config = require('../config.json');

export default function SearchPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [genre, setGenre] = useState([]);
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [checkedGenres, setCheckedGenres] = useState([]);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState([1888, 2030]);
  const [runtimeMinutes, setTime] = useState([0, 43200]);
  const [isAdult, setIsAdult] = useState(false);

  const toggleCheckedGenre = (t) => {
    if (checkedGenres.includes(t)) {
      setCheckedGenres(checkedGenres.filter((_t) => _t !== t));
    } else {
      setCheckedGenres([...checkedGenres, t]);
    }
  };

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/distinct_types`)
        .then(res => res.json())
        .then(resJson => {
            const all_types = resJson.map((t) => (t.titleType));
            setTypes(all_types);
        });
    fetch(`http://${config.server_host}:${config.server_port}/distinct_genres`)
        .then(res => res.json())
        .then(resJson => {
            const all_gernes = resJson.map((g) => (g.genre));
            setGenre(all_gernes);
        });
    fetch(`http://${config.server_host}:${config.server_port}/filter_movie`)
      .then(res => res.json())
      .then(resJson => {
        const videoWithID = resJson.map((video) => ({ id: video.tconst, ...video }));
        setData(videoWithID);
      });
  }, []);

  const search = () => {
    const genreStr = checkedGenres.join(",");
    fetch(`http://${config.server_host}:${config.server_port}/filter_movie?title=${title}` +
      `&startYear=${year[0]}&endYear=${year[1]}` +
      `&runtimeMinutesLow=${runtimeMinutes[0]}&runtimeMinutesHigh=${runtimeMinutes[1]}` +
      `&isAdult=${isAdult}&type=${type}&genres=${genreStr}`
    )
      .then(res => res.json())
      .then(resJson => {
        const videoWithID = resJson.map((video) => ({ id: video.tconst, ...video }));
        setData(videoWithID);
      });
  }

  const columns = [
    { field: 'primaryTitle', headerName: 'Title', renderCell: (params) => (
        <Link component={NavLink} to={`/media/${params.row.tconst}`}>{params.value}</Link>
    ), flex:3 },
    { field: 'startYear', headerName: 'Years', flex: 1 },
    { field: 'runtimeMinutes', headerName: 'RuntimeMinutes', flex: 1}
  ]

  return (
    <Container>
      {/* {selectedVideoId && <MediaPage mediaId={selectedVideoId} handleClose={() => setSelectedVideoId(null)} />} */}
      <Typography variant ='h1' align='center'sx={{ 
        color: 'secondary',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        padding: '20px'
      }}>
        Search Videos
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Adult'
            control={<Checkbox checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} />}
          />
        </Grid>
        <h3>Type</h3>
        <Grid container spacing = {2}>
        <RadioGroup value={type} onChange={(event) => setType(event.target.value)} row>
        {types.map((t) => (
                <FormControlLabel
                value={t}
                label={t}
                control={<Radio />} />
            ))}
        </RadioGroup>
        </Grid>
        <h3>Genre</h3>
        <Grid container spacing = {2}>
        {genre.map((g) => (
            <Grid item key={g} xs={2}>
                <FormControlLabel
                label={g}
                control={<Checkbox checked={checkedGenres.includes(g)} onChange={() => toggleCheckedGenre(g)} />}
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
        <Grid item xs={6}>
          <p>Duration</p>
          <Slider
            value={runtimeMinutes}
            min={0}
            max={43200}
            step={10}
            onChange={(e, newValue) => setTime(newValue)}
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
        checkboxSelection={false} 
        disableSelectionOnClick={true}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}