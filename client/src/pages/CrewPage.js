import { Card, CardContent, Container, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const config = require('../config.json');

export default function CrewPage() {
  const [crewTrend, setCrewTrend] = useState([]);
  const [crewInfo, setCrewInfo] = useState(null);
  const {crewid} = useParams();

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/rating_trend/${crewid}`)
      .then(res => res.json())
      .then(resJson => setCrewTrend(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/crew/${crewid}`)
      .then(res => res.json())
      .then(resJson => {
        setCrewInfo(resJson[0]);
      });
  }, [crewid]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="md">
        {crewInfo && (
          <Card sx={{ marginBottom: '24px' }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {crewInfo.primaryName ? crewInfo.primaryName : 'N/A'}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {crewInfo.primaryProfession ? crewInfo.primaryProfession : 'N/A'}
              </Typography>
              <Typography variant="body2">
                {crewInfo.birthYear ? `Born: ${crewInfo.birthYear}` : 'Birth year not available'}
              </Typography>
              <Typography variant="body2">
                {crewInfo.deathYear ? `Died: ${crewInfo.deathYear}` : ''}
                {crewInfo.age ? ` (Aged ${crewInfo.age})` : ''}
              </Typography>
            </CardContent>
          </Card>
        )}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={crewTrend}>
            <XAxis dataKey="startYear" />
            <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]}/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="average_rating" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    </div>
  );
}
