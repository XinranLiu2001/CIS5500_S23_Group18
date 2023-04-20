import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// NavBar with MUI
export default function NavBar() {
  return (
    <AppBar position='static' color="secondary">
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='IMDB' isMain />
          <NavText href='/movies' text='MOVIES' />
          <NavText href='/people' text='PEOPLE' />
          <NavText href='/search' text='SEARCH' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}