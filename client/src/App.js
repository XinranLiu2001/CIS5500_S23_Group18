import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CrewPage from './pages/CrewPage';
import MediaPage from './pages/MediaPage';

// createTheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />}/>
          <Route path="/crew/:crewid" element={<CrewPage />}/>
          <Route path="/media/:mediaid" element={<MediaPage />}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}