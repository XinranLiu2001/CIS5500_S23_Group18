const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /author/:type
const author = async function(req, res) {
  const name = 'Team18';

  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else {
    res.status(400).send(`'${req.params.type}' is not a valid author type. `);
  }
}

/**********************
 * Basic routes
 **********************/
// Route 1: GET /search
const search = async function(req, res) {
  const search_text = req.query.text
  if(search_text){
    connection.query(`
    SELECT DISTINCT title FROM
    (
      (
      SELECT titleId AS tconst, title AS title FROM akas
      WHERE X LIKE '${search_text}'
      )
      UNION
      (
      SELECT tconst, primaryTitle AS title FROM movie_basics
      WHERE X LIKE '${search_text}')
    )
    `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
  } else {
    connection.query(`
      SELECT tconst, primaryTitle AS title FROM movie_basics
    `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
  }
  
}

// TODO: need to modify the query, we need abbreviate info for each movie to display
//Route 2: Get /type/:type
const get_type = async function (req, res){
  const type = req.params.type
  connection.query(`
    SELECT tconst, primaryTitle, startYear
    FROM movie_basics
    WHERE titleType = '${type}';
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

//TODO: the query needs at least to display the movie's title
//Route 3: GET /filter_movie
//genre type: "a,b,c" 
const filter_movie = async function (req, res){
  const isAdult = req.query.isAdult ?? 0
  const startYear = req.query.startYear ?? 2000
  const endYear = req.query.endYear ?? 2023
  const runtimeMinutesLow = req.query.runtimeMinutesLow ?? 60
  const runtimeMinutesHigh = req.query.runtimeMinutesHigh ?? 120
  const genres = req.query.genres ?? ''
  if(genres === ''){
  connection.query(`
    SELECT tconst, primaryTitle
    FROM movie_basics
    WHERE isAdult = ${isAdult}
    AND startYear >= ${startYear}
    AND endYear <= ${endYear}
    AND runtimeMinutes >= ${runtimeMinutesLow}
    AND runtimeMinutes <= ${runtimeMinutesHigh};
  `, (err, data) => {
      if(err || data.length === 0){
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    genres_split = genres.split(',')
    if(genres_split.length === 1){
      connection.query(`
      SELECT tconst, primaryTitle
      FROM movie_basics
      WHERE LOWER(genres) LIKE '%${genres_split[0]}%'
      AND isAdult = ${isAdult}
      AND startYear >= ${startYear}
      AND endYear <= ${endYear}
      AND runtimeMinutes >= ${runtimeMinutesLow}
      AND runtimeMinutes <= ${runtimeMinutesHigh};
      `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else if(genres_split.length === 2){
      connection.query(`
      SELECT tconst, primaryTitle
      FROM movie_basics
      WHERE LOWER(genres) LIKE '%${genres_split[0]}%'
      AND LOWER(genres) LIKE '%${genres_split[1]}%'
      AND isAdult = ${isAdult}
      AND startYear >= ${startYear}
      AND endYear <= ${endYear}
      AND runtimeMinutes >= ${runtimeMinutesLow}
      AND runtimeMinutes <= ${runtimeMinutesHigh};
      `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else if(genres_split.length === 3){
      connection.query(`
      SELECT tconst, primaryTitle
      FROM movie_basics
      WHERE LOWER(genres) LIKE '%${genres_split[0]}%'
      AND LOWER(genres) LIKE '%${genres_split[1]}%'
      AND LOWER(genres) LIKE '%${genres_split[2]}%'
      AND isAdult = ${isAdult}
      AND startYear >= ${startYear}
      AND endYear <= ${endYear}
      AND runtimeMinutes >= ${runtimeMinutesLow}
      AND runtimeMinutes <= ${runtimeMinutesHigh};
      `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      // we only have at most three genres for each movie, thus when having
      // more than three genres, it is impossible for use to have any video fit the result
      res.json([])
    }
  }
}

//Route 4: GET /distinct_genres
const get_distinct_genres = async function (req, res){
  connection.query(`
    WITH separate_genres
    AS
    ((SELECT SUBSTRING_INDEX(genres, ',', 1) AS genre FROM movie_basics)
        UNION
    (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(genres,',', 2), ',',-1) AS genre FROM movie_basics)
        UNION
    (SELECT SUBSTRING_INDEX(genres, ',', -1) AS genre FROM movie_basics))
    SELECT distinct(genre) FROM separate_genres WHERE genre IS NOT NULL ORDER BY genre;
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

//Route 5: GET /distinct_types
const get_distinct_types = async function (req, res){
  connection.query(`
    SELECT DISTINCT titleType FROM movie_basics ORDER BY titleType;
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

//Route 6: GET /video/:tconst
const get_video_info = async function (req, res){
  const tconst = req.params.tconst
  connection.query(`
    SELECT B.StartYear, B.EndYear, A.title, A.language, B.isAdult, B.titleType AS type FROM movie_basics B JOIN aka A
    ON B.tconst = A.titleId WHERE B.tconst = ${tconst};
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

//Route 7: GET /video_crew/:tconst
const get_video_crew = async function (req, res){
  const tconst = req.params.tconst
  connection.query(`
  SELECT B.category, B.characters, C.primaryName, C.birthYear, C.deathYear FROM movie_basics A
  JOIN principals B ON A.tconst = B.tconst
  JOIN name_basics C ON B.nconst = C.nconst
  WHERE A.tconst = '${tconst}'
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 8: GET /top5/:year/:type
const get_top5 = async function (req, res){
  const year = req.params.year
  const type = req.params.type ?? ''
  if(type){
    if(year){
      connection.query(`
        SELECT mb.primaryTitle, rt.averageRating, rt.numVotes FROM movie_basics mb
        JOIN ratings rt ON mb.tconst = rt.tconst
        WHERE mb.startYear = ${year} AND mb.titleType = '${type}' ORDER BY rt.averageRating DESC
        LIMIT 5
      `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
        SELECT mb.primaryTitle, rt.averageRating, rt.numVotes FROM movie_basics mb
        JOIN ratings rt ON mb.tconst = rt.tconst
        WHERE mb.titleType = '${type}' ORDER BY rt.averageRating DESC
        LIMIT 5
      `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  } else {
    if(year){
      connection.query(`
        SELECT mb.primaryTitle, rt.averageRating, rt.numVotes FROM movie_basics mb
        JOIN ratings rt ON mb.tconst = rt.tconst
        WHERE mb.startYear = ${year} ORDER BY rt.averageRating DESC
        LIMIT 5
      `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
        SELECT mb.primaryTitle, rt.averageRating, rt.numVotes FROM movie_basics mb
        JOIN ratings rt ON mb.tconst = rt.tconst
        ORDER BY rt.averageRating DESC
        LIMIT 5
      `, (err, data) => {
        if(err || data.length === 0){
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  }
}

// Route 9: GET /top1000
const get_top1000 = async function (req, res){
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(`
      WITH C AS(
      SELECT B.*, A.averageRating, A.numVotes FROM movie_basics B
      INNER JOIN ratings A
      ON B.tconst = A.tconst),
      rs AS(
      SELECT C.tconst, C.primaryTitle, C.titleType, C.averageRating, C.startYear, Rank() OVER(
      Partition BY C.titleType, C.startYear
      ORDER BY C.averageRating DESC) AS rn
      FROM C)
      SELECT rs.tconst, rs.primaryTitle, rs.titleType, rs.averageRating, rs.startYear, pr.nconst, pr.category
      FROM rs
      JOIN principals pr
      ON rs.tconst = pr.tconst WHERE rs.rn <= 1000
    `, (err, data) => {
      if(err || data.length === 0){
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = (page-1) * pageSize
    connection.query(`
      WITH C AS(
      SELECT B.*, A.averageRating, A.numVotes FROM movie_basics B
      INNER JOIN ratings A
      ON B.tconst = A.tconst),
      rs AS(
      SELECT C.tconst, C.primaryTitle, C.titleType, C.averageRating, C.startYear, Rank() OVER(
      Partition BY C.titleType, C.startYear
      ORDER BY C.averageRating DESC) AS rn
      FROM C)
      SELECT rs.tconst, rs.primaryTitle, rs.titleType, rs.averageRating, rs.startYear, pr.nconst, pr.category
      FROM rs
      JOIN principals pr
      ON rs.tconst = pr.tconst WHERE rs.rn <= 1000
      LIMIT ${pageSize} OFFSET ${offset};
    `, (err, data) => {
      if(err || data.length === 0){
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }

}

// Route 10: GET /top1000
const get_people = async function (req, res){
  connection.query(`
    WITH TMP_TABLE AS(
    SELECT T2.primaryTitle AS MediaTitle, D.averageRating, T2.People, T2.PersonName,
    T2.Age FROM
    (SELECT T1.tconst, T1.primaryTitle, T1.isAdult, T1.category AS People, C.primaryName AS PersonName,
    IF(C.deathYear IS NULL, 2023 - C.birthYear, C.deathYear - C.birthYear) AS age FROM
    (SELECT A.tconst, A.primaryTitle, A.isAdult, A.startYear, B.category, B.nconst FROM movie_basics A
    JOIN principals B ON A.tconst = B.tconst) T1
    JOIN name_basics C ON C.nconst = T1.nconst
    WHERE T1.category IN ('actress', 'actor') AND T1.isAdult = 0) T2 JOIN ratings D ON D.tconst = T2.tconst
    WHERE D.averageRating > 5)
    SELECT MediaTitle, averageRating, GROUP_CONCAT(PersonName SEPARATOR '; ') AS MainActorActress, AVG(age) AS Avg_age
    FROM TMP_TABLE
    GROUP BY MediaTitle, averageRating
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}


module.exports = {
  author,
  search,
  get_type,
  filter_movie,
  get_distinct_genres,
  get_distinct_types,
  get_video_info,
  get_video_crew,
  get_top5,
  get_top1000,
  get_people
}
