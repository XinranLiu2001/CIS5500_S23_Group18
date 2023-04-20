import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function SearchPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [genre, setGenre] = useState([]);
  const [type, setType] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const [checkedTypes, setCheckedTypes] = useState([]);
  // const handleCheckedTypesChange = (newCheckedTypes) => {
  //   setCheckedTypes(newCheckedTypes);
  // };

  const toggleCheckedType = (t) => {
    if (checkedTypes.includes(t)) {
      setCheckedTypes(checkedTypes.filter((_t) => _t !== t));
    } else {
      setCheckedTypes([t]);
    }
  };

  const [checkedGenres, setCheckedGenres] = useState([]);
  // const handleCheckedGenresChange = (newCheckedGenres) => {
  //   setCheckedGenres(newCheckedGenres);
  // };

  const toggleCheckedGenre = (t) => {
    if (checkedGenres.includes(t)) {
      setCheckedGenres(checkedGenres.filter((_t) => _t !== t));
    } else {
      setCheckedGenres([...checkedGenres, t]);
    }
  };

  const [title, setTitle] = useState('');
  const [year, setYear] = useState([1888, 2030]);
  const [runtimeMinutes, setTime] = useState([0, 43200]);
  const [isAdult, setIsAdult] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/distinct_types`)
        .then(res => res.json())
        .then(resJson => {
            const all_types = resJson.map((t) => (t.titleType));
            setType(all_types);
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
      `&isAdult=${isAdult}&type=${type[0]}&genres=${genreStr}`
    )
      .then(res => res.json())
      .then(resJson => {
        const videoWithID = resJson.map((video) => ({ id: video.tconst, ...video }));
        setData(videoWithID);
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'primaryTitle', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedVideoId(params.row.tconst)}>{params.value}</Link>
    ) }
    // { field: 'startYear', headerName: 'Years' },
    // { field: 'runtimeMinutes', headerName: 'RuntimeMinutes' },
    // { field: 'isAdult', headerName: 'Adult' },
  ]

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>
      {/* {selectedVideoId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />} */}
      <h2>Search Videos</h2>
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
        {type.map((t) => (
            <Grid item key={t} xs={2}>
                <FormControlLabel
                label={t}
                control={<Checkbox checked={checkedTypes.includes(t)} onChange={() => toggleCheckedType(t)} />}
                />
            </Grid>
            ))}
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
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}