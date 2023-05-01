import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SearchCrewPage from './pages/SearchCrewPage';
import CrewPage from './pages/CrewPage';
import MediaPage from './pages/MediaPage';
import GenrePage from './pages/GenrePage';

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
          <Route path="/search_video" element={<SearchPage />}/>
          <Route path="/search_crew" element={<SearchCrewPage />}/>
          <Route path="/crew/:crewid" element={<CrewPage />}/>
          <Route path="/media/:mediaid" element={<MediaPage />}/>
          <Route path="/genres" element={<GenrePage />}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}