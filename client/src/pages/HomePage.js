import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
const config = require('../config.json');

export default function HomePage() {
  const [appAuthor, setAppAuthor] = useState('');
  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
    .then(res => res.text())
    .then(nametext => {
      setAppAuthor(nametext);
    });
  }, []);

  const songColumns = [
    {
      field: 'primaryTitle',
      headerName: 'Movie Title',
      // renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> 
    },
    {
      field: 'averageRating',
      headerName: 'Average Rating',
      // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink>
    },
    {
      field: 'numVotes',
      headerName: 'Number of Votes'
    },
  ];

  const top1000record = [
    {
      field: 'Title',
      headerName: 'Movie Title',
      // renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> 
    },
    {
      field: 'averageRating',
      headerName: 'Average Rating',
      // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink>
    },
    {
      field: 'startYear',
      headerName: 'Year'
    },
    {
      field: 'category',
      headerName: 'Category'
    },
    {
      field: 'crew',
      headerName: 'Crew'
    },
  ];

  return (
    <Container>
      {/* <h2>Homepage
        <Link onClick={() => setSelectedSongId(songOfTheDay.song_id)}>{songOfTheDay.title}</Link>
      </h2>
      <Divider /> */}
      <h2>Top 1000</h2>
      {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top5/2021/movie`} columns={songColumns} /> */}
      <LazyTable route={`http://${config.server_host}:${config.server_port}/movie_pop_crew`} columns={top1000record} />
      <Divider />
      <p>{appAuthor}</p>
    </Container>
  );
};
