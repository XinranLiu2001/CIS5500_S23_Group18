import { Container, List, ListItem, ListItemText, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom';
import { Box } from '@mui/system';


const config = require('../config.json');

export default function MediaPage() {
  const [mediaInfo, setMediaInfo] = useState([]);
  const [crewInfo, setCrewInfo] = useState([]);
  const [popInfo, setPopInfo] = useState([]);

  const {mediaid} = useParams();

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/video/${mediaid}`)
    // tt0001980
      .then(res => res.json())
      .then(resJson => setMediaInfo(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/video_crew/${mediaid}`)
      .then(res => res.json())
      .then(resJson => setCrewInfo(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/movie_pop_crew/${mediaid}`)
      .then(res => res.json())
      .then(resJson => setPopInfo(resJson));
  }, [mediaid]);

  return (
    <Container>
      <Container maxWidth="md">
        <Typography align='center' variant="h3" sx={{ mb: 4, mt: 4 }}>
          {mediaInfo.length > 0 ? (
            <Typography align='center' variant="h3" sx={{ mb: 2 }}>
              {mediaInfo[0].originalTitle ? mediaInfo[0].originalTitle : 'N/A'}
            </Typography>
          ) : (
            <Typography align='center' variant="h3" sx={{ mb: 2 }}>
            </Typography>
          )}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: '#e1f5fe', p: 2, borderRadius: 1 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Media Info
              </Typography>
              {mediaInfo.length > 0 ? (
                <List>
                  <ListItem>
                    {`Runtime: ${mediaInfo[0].runtimeMinutes? mediaInfo[0].runtimeMinutes : 'N/A'} minutes`}
                  </ListItem>
                  <ListItem>
                    {`Genre: ${mediaInfo[0].genres? mediaInfo[0].genres : 'N/A'}`}
                  </ListItem>
                  <ListItem>
                    {`Adult: ${mediaInfo[0].isAdult? 'Yes' : 'No'}`}
                  </ListItem>
                  {mediaInfo.map((media, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={media.title ? 'Title in Different Region:' :""}
                        secondary={media.title ? `${media.title} (Language: ${media.language})` : ""}
                        // secondary={`Runtime: ${media.runtimeMinutes}, Adult: ${media.isAdult ? 'Yes' : 'No'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">
                  No information available for this media.
                </Typography>
              )}
            </Box>
          </Grid>
          {/* <Box
            sx={{
              width: '1px',
              bgcolor: 'divider',
              my: 1,
              mx: 2,
              height: '100%',
            }}
          /> */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ bgcolor: '#fce4ec', p: 2, borderRadius: 1, mb: 2, flexGrow: 1 }}>

                <Typography variant="h4" sx={{ mb: 2 }}>
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
              </Box>
              <Box sx={{ bgcolor: '#fff9c4', p: 2, borderRadius: 1 }}>
                <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                  Pop Crew Info
                </Typography>
                {popInfo.length > 0 ? (
                  <List>
                    {popInfo.map((pop, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={
                            // <Link to={`/crew/${pop.MainActorActress_nconst}`}>
                              pop.MainActorActress ? pop.MainActorActress : 'N/A'
                            // </Link>
                          }
                          secondary={`Average Rating: ${pop.averageRating ? pop.averageRating : 'N/A'}, Average Age: ${pop.Avg_age ? pop.Avg_age : 'N/A'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2">
                    No crew information available for this video.
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}
