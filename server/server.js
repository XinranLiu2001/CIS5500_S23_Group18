const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// API endpoints
// handlers in routes.js
app.get('/search', routes.search);
app.get('/type/:type', routes.get_type);
app.get('/filter_movie', routes.filter_movie);
app.get('/distinct_genres', routes.get_distinct_genres);
app.get('/distinct_types', routes.get_distinct_types);
app.get('/video/:tconst', routes.get_video_info);
app.get('/video_crew/:tconst', routes.get_video_crew);
app.get('/top5/:year/:type', routes.get_top5);
app.get('/top1000/:year/:genre', routes.get_top1000);
app.get('/movie_pop_crew/:tconst', routes.movie_pop_crew);
app.get('/pop_people_media', routes.pop_people_media);
app.get('/rating_trend/:crew', routes.rating_trend);
app.get('/crew/:nconst', routes.get_crew_info);
app.get('/search_crew', routes.search_crew_info);
app.get('/distinct_professions', routes.get_distinct_professions);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;

