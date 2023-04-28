import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom';

const config = require('../config.json');

export default function MediaPage() {
  const [mediaInfo, setMediaInfo] = useState([]);
  const [crewInfo, setCrewInfo] = useState([]);
  const {mediaid} = useParams();

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/video/${mediaid}`)
    // tt0001980
      .then(res => res.json())
      .then(resJson => setMediaInfo(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/video_crew/${mediaid}`)
      .then(res => res.json())
      .then(resJson => setCrewInfo(resJson));
  }, [mediaid]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Media Info
        </Typography>
        {mediaInfo.length > 0 ? (
          <List>
            {mediaInfo.map((media, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${media.title} (${media.language})`}
                  secondary={`Genres: ${media.genres}, Type: ${media.type}, Adult: ${media.isAdult ? 'Yes' : 'No'}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2">
            No information available for this media.
          </Typography>
        )}
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Crew Info
        </Typography>
        {crewInfo.length > 0 ? (
          <List>
            {crewInfo.map((crew, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    <Link to={`/crew/${crew.nconst}`}>
                      {crew.primaryName ? crew.primaryName : 'N/A'}
                    </Link>
                  }
                  secondary={`Category: ${crew.category ? crew.category : 'N/A'}, Characters: ${crew.characters ? crew.characters : 'N/A'}, ${crew.birthYear ? `Born in ${crew.birthYear}` : 'Birth year not available'}, ${crew.deathYear ? `died in ${crew.deathYear}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2">
            No crew information available for this video.
          </Typography>
        )}
      </Container>
    </div>
  );
}
