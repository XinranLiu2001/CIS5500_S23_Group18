import { useEffect, useState } from 'react';
import { Button, Checkbox, Autocomplete, FormGroup, Switch, Container, Typography, FormControlLabel, Grid, Link, Slider, TextField, Radio, RadioGroup} from '@mui/material';
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
  const [selectedGenres, setSelectedGenres] = useState([]);
  // const [checkedGenres, setCheckedGenres] = useState([]);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState([1888, 2030]);
  const [runtimeMinutes, setTime] = useState([0, 43200]);
  const [isAdult, setIsAdult] = useState(false);

  // const toggleCheckedGenre = (t) => {
  //   if (checkedGenres.includes(t)) {
  //     setCheckedGenres(checkedGenres.filter((_t) => _t !== t));
  //   } else {
  //     setCheckedGenres([...checkedGenres, t]);
  //   }
  // };

  const handleSelectedType = (event, type) => {
    if (!type) {
      setType("");
    } else {
      setType(type);
    }
  };
  

  const handleSelectedGenres = (event, selectedGenres) => {
    setSelectedGenres(selectedGenres);
  };
  
  const handleIsAdultChange = (event) => {
    setIsAdult(event.target.checked);
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
    // const genreStr = checkedGenres.join(",");
    const genreStr = selectedGenres.join(",");
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
        <Link component={NavLink} to={`/media/${params.row.tconst}`} color="secondary" style={{ color: '#FFA000' }}>{params.value}</Link>
    ), flex:3, headerClassName:'cell12'},
    { field: 'startYear', headerName: 'Years', flex: 1, headerClassName:'cell12' },
    { field: 'runtimeMinutes', headerName: 'Length (in Minutes)', flex: 1.5, headerClassName:'cell12'},
    { field: 'titleType', headerName: 'Type', flex:1, headerClassName:'cell12', cellClassName: (params) => {
      const type = params.value;
      switch (type) {
        case 'movie':
          return 'cell1';
        case 'tvSeries':
          return 'cell2';
        case 'short':
          return 'cell3';
        case 'tvMovie':
          return 'cell4';
        case 'tvMiniSeries':
          return 'cell5';
        case 'tvPilot':
          return 'cell6';
        case 'tvSpecial':
          return 'cell7';
        case 'tvEpisode':
          return 'cell8';
        case 'tvSeries':
          return 'cell9';
        case 'tvShort':
          return 'cell10';
        case 'video':
          return 'cell11';
        case 'videoGame':
          return 'cell12';
        default:
          return 'cell12';
      }
    },},
    { field: 'isAdult', headerName: 'Adult', headerClassName:'cell12', flex:1},
    { field: 'genres', headerName: 'Genre', headerClassName:'cell12', flex:2}
  ]

  return (
    <Container>
      {/* {selectedVideoId && <MediaPage mediaId={selectedVideoId} handleClose={() => setSelectedVideoId(null)} />} */}
      <Typography variant ='h1' align='center'sx={{ 
        fontFamily: 'monospace',
        fontWeight: 'bold',
        padding: '20px'
      }}>
        Search Videos
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <TextField label="Search for a video's title or akas" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
        <Button color="secondary" onClick={() => search() } variant="contained" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
        </Button>
        </Grid>
        <h2>Features</h2>
        <Grid container spacing = {4} justifyContent="center">
        {/* <RadioGroup value={type} onChange={(event) => setType(event.target.value)} row>
        {types.map((t) => (
            <Grid item key={t} xs={2}>
                <FormControlLabel
                value={t}
                label={t}
                control={<Radio />} />
                </Grid>
            ))}
        </RadioGroup> */}
        <Grid item>
        <Autocomplete
          color="secondary"
          id="single type"
          options={types}
          value={type}
          onChange={handleSelectedType}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField color="warning" {...params} label="Type" />
          )}
          sx={{ width: '500px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey' },
              '&:focus-within .MuiOutlinedInput-notchedOutline': { borderColor: 'yellow' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'yellow' }, }}
        />
        </Grid>

        {/* {genre.map((g) => (
            <Grid item key={g} xs={2}>
                <FormControlLabel
                label={g}
                control={<Checkbox checked={checkedGenres.includes(g)} onChange={() => toggleCheckedGenre(g)} />}
                />
            </Grid>
            ))} */}
            <Grid item>
            <Autocomplete
              color="secondary"
              multiple
              limitTags={3}
              id="multiple-limit-genres"
              options={genre}
              value={selectedGenres}
              onChange={handleSelectedGenres}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField color="warning" {...params} label="Genre" />
              )}
              sx={{ width: '500px', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey' },
              '&:focus-within .MuiOutlinedInput-notchedOutline': { borderColor: 'yellow' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'yellow' }, }}
            />
            </Grid>
        </Grid>

        <Grid item xs={6}>
          <p>Released Year Range</p>
          <Slider
            color="secondary"
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
            color="secondary"
            value={runtimeMinutes}
            min={0}
            max={43200}
            step={10}
            onChange={(e, newValue) => setTime(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={8}>
        <FormGroup>
            <FormControlLabel
                control={<Switch color="warning" onChange={handleIsAdultChange} checked={isAdult} />}
                label="Adult"
            />
        </FormGroup>
        </Grid>
      </Grid>
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