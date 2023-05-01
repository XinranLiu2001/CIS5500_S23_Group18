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

//Route 3: GET /filter_movie
//genre type: "a,b,c" 
const filter_movie = async function (req, res){
  const search_text = req.query.search_text ?? '';
  const isAdult = req.query.isAdult === 'true' ? 1 : 0;
  const startYear = req.query.startYear ?? 1888
  const endYear = req.query.endYear ?? 2030
  const runtimeMinutesLow = req.query.runtimeMinutesLow ?? 0
  const runtimeMinutesHigh = req.query.runtimeMinutesHigh ?? 43200
  const genres = req.query.genres ?? ''
  const type = req.query.type ?? ''
  let genre1 = ''
  let genre2 = ''
  let genre3 = ''
  genres_split = genres.split(',')
  if(genres_split.length === 1) {
    genre1 = genres_split[0];
  } else if (genres_split.length === 2) {
    genre1 = genres_split[0];
    genre2 = genres_split[1];
  } else if (genres_split.length === 3) {
    genre1 = genres_split[0];
    genre2 = genres_split[1];
    genre3 = genres_split[2];
  } else if (genres_split.length > 3){
    res.json([]);
    return;
  } else {
    console.log('no genre');
  }

  if(type == ''){
    if(isAdult === 1){
      connection.query(`
        WITH tmp_table AS(
          SELECT mb.tconst, genres, primaryTitle, titleType, GROUP_CONCAT(DISTINCT a.title SEPARATOR '; ') AS otherTitles,
          isAdult, startYear, runtimeMinutes
        FROM movie_basics mb JOIN akas a on mb.tconst = a.titleID
        GROUP BY genres, primaryTitle)

        SELECT tconst, primaryTitle, startYear, runtimeMinutes, genres, titleType, isAdult FROM tmp_table
        WHERE genres LIKE '%${genre1}%' AND genres LIKE '%${genre2}%' AND genres LIKE '%${genre3}%'
        AND (primaryTitle LIKE '%${search_text}%' OR otherTitles LIKE '%${search_text}%')
        AND isAdult = ${isAdult}
        AND startYear >= ${startYear}
        AND startYear <= ${endYear}
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
      connection.query(`
        WITH tmp_table AS(
          SELECT mb.tconst, genres, primaryTitle, titleType, GROUP_CONCAT(DISTINCT a.title SEPARATOR '; ') AS otherTitles,
          isAdult, startYear, runtimeMinutes
        FROM movie_basics mb JOIN akas a on mb.tconst = a.titleID
        GROUP BY genres, primaryTitle)

        SELECT tconst, primaryTitle, startYear, runtimeMinutes, genres, titleType, isAdult FROM tmp_table
        WHERE genres LIKE '%${genre1}%' AND genres LIKE '%${genre2}%' AND genres LIKE '%${genre3}%'
        AND (primaryTitle LIKE '%${search_text}%' OR otherTitles LIKE '%${search_text}%')
        AND startYear >= ${startYear}
        AND startYear <= ${endYear}
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
    }
  } else {
    if(isAdult === 1){
      connection.query(`
        WITH tmp_table AS(SELECT mb.tconst, genres, primaryTitle, titleType, GROUP_CONCAT(DISTINCT a.title SEPARATOR '; ') AS otherTitles,
        isAdult, startYear, runtimeMinutes
        FROM movie_basics mb JOIN akas a on mb.tconst = a.titleID
        GROUP BY genres, primaryTitle)

        SELECT tconst, primaryTitle, startYear, runtimeMinutes, genres, titleType, isAdult FROM tmp_table
        WHERE genres LIKE '%${genre1}%' AND genres LIKE '%${genre2}%' AND genres LIKE '%${genre3}%'
        AND (primaryTitle LIKE '%${search_text}%' OR otherTitles LIKE '%${search_text}%')
        AND titleType = '${type}'
        AND isAdult = ${isAdult}
        AND startYear >= ${startYear}
        AND startYear <= ${endYear}
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
      connection.query(`
        WITH tmp_table AS(SELECT mb.tconst, genres, primaryTitle, titleType, GROUP_CONCAT(DISTINCT a.title SEPARATOR '; ') AS otherTitles,
        isAdult, startYear, runtimeMinutes
        FROM movie_basics mb JOIN akas a on mb.tconst = a.titleID
        GROUP BY genres, primaryTitle)

        SELECT tconst, primaryTitle, startYear, runtimeMinutes, genres, titleType, isAdult FROM tmp_table
        WHERE genres LIKE '%${genre1}%' AND genres LIKE '%${genre2}%' AND genres LIKE '%${genre3}%'
        AND (primaryTitle LIKE '%${search_text}%' OR otherTitles LIKE '%${search_text}%')
        AND titleType = '${type}'
        AND startYear >= ${startYear}
        AND startYear <= ${endYear}
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
    SELECT B.StartYear, B.EndYear, B.originalTitle, A.title, A.language, B.isAdult, B.titleType, B.runtimeMinutes, B.genres
    FROM movie_basics B LEFT JOIN akas A
        ON B.tconst = A.titleId WHERE B.tconst = '${tconst}';
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
// add nconst
const get_video_crew = async function (req, res){
  const tconst = req.params.tconst
  connection.query(`
    SELECT B.nconst, B.category, B.characters, C.primaryName, C.birthYear, C.deathYear FROM movie_basics A
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
// add tconst change!!!! show add limitation 
const get_top5 = async function (req, res){
  const year = req.params.year
  const type = req.params.type ?? ''
  if(type){
    if(year){
      connection.query(`
        SELECT mb.tconst, mb.primaryTitle, rt.averageRating, rt.numVotes FROM movie_basics mb
        JOIN ratings rt ON mb.tconst = rt.tconst
        WHERE mb.startYear = ${year} AND mb.titleType = '${type}' AND rt.numVotes > 1000 
        ORDER BY rt.averageRating DESC, rt.numVotes DESC
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
        SELECT mb.tconst, mb.primaryTitle, rt.averageRating, rt.numVotes FROM movie_basics mb
        JOIN ratings rt ON mb.tconst = rt.tconst
        WHERE mb.titleType = '${type}' AND rt.numVotes > 1000 
        ORDER BY rt.averageRating DESC, rt.numVotes DESC
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
        SELECT mb.tconst, mb.primaryTitle, rt.averageRating, rt.numVotes FROM movie_basics mb
        JOIN ratings rt ON mb.tconst = rt.tconst
        WHERE mb.startYear = ${year} AND rt.numVotes > 1000 
        ORDER BY rt.averageRating DESC, rt.numVotes DESC
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
        SELECT mb.tconst, mb.primaryTitle, rt.averageRating, rt.numVotes FROM movie_basics mb
        JOIN ratings rt ON mb.tconst = rt.tconst
        WHERE rt.numVotes > 1000
        ORDER BY rt.averageRating DESC, rt.numVotes DESC
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

// Route 9: GET /movie_pop_crew/:tconst
const movie_pop_crew = async function (req, res){
  const tconst = req.params.tconst

  connection.query(`
  WITH TMP_TABLE AS(
      SELECT T2.primaryTitle AS MediaTitle, D.averageRating, T2.People, T2.PersonName,
      T2.Age, T2.nconst, T2.tconst AS Mediatconst
      FROM
      (SELECT T1.tconst, T1.primaryTitle, T1.isAdult, T1.category AS People, C.primaryName AS PersonName, T1.nconst,
      IF(C.deathYear IS NULL, 2023 - C.birthYear, C.deathYear - C.birthYear) AS age FROM
      (SELECT A.tconst, A.primaryTitle, A.isAdult, A.startYear, B.category, B.nconst FROM movie_basics A
      JOIN principals B ON A.tconst = B.tconst) T1
      JOIN name_basics C ON C.nconst = T1.nconst
      WHERE T1.category IN ('actress', 'actor') AND T1.isAdult = 0) T2 JOIN ratings D ON D.tconst = T2.tconst
      WHERE D.averageRating > 5)
      SELECT Mediatconst, MediaTitle, averageRating, GROUP_CONCAT(PersonName SEPARATOR '; ') AS MainActorActress,
            GROUP_CONCAT(nconst SEPARATOR '; ') AS MainActorActress_nconst, AVG(age) AS Avg_age
      FROM TMP_TABLE
      WHERE Mediatconst = '${tconst}'
      GROUP BY MediaTitle, averageRating;
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 10: GET /rating_trend/:crew
// simple?
const rating_trend = async function (req, res){
  const crewid = req.params.crew
  connection.query(`
    WITH tmp_table AS(
    SELECT T2.primaryTitle AS MediaTitle, D.averageRating, T2.People, T2.PersonName,
          T2.category, T2.startYear, T2.birthyear, T2.nconst
    FROM
        (SELECT T1.tconst, T1.primaryTitle, T1.isAdult, T1.category AS People, C.primaryName AS PersonName, T1.startYear,
                T1.category, C.birthyear, C.nconst AS nconst
        FROM
            (SELECT A.tconst, A.primaryTitle, A.isAdult, A.startYear, B.category, B.nconst
            FROM movie_basics A
            JOIN principals B ON A.tconst = B.tconst) T1
        JOIN name_basics C ON C.nconst = T1.nconst
        WHERE T1.category IN ('actress', 'actor', 'director', 'writer', 'composer') AND T1.isAdult = 0) T2
    JOIN ratings D ON D.tconst = T2.tconst)

    SELECT PersonName, startYear, People, AVG(averageRating) AS average_rating, startYear-birthyear AS currentAge,
          GROUP_CONCAT(MediaTitle SEPARATOR '; ') AS mainMedia
    FROM tmp_table
    WHERE nconst = '${crewid}'
    GROUP BY PersonName, startYear
    ORDER BY PersonName, startYear;
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 11: GET /top1000/:year/:genre
const get_top1000 = async function (req, res){
  const year = req.params.year
  const genre = req.params.genre
  connection.query(`
    WITH C AS(
    SELECT movie_basics.tconst, SUBSTRING_INDEX(genres, ',', 1) AS genre
    FROM movie_basics
    UNION
    SELECT movie_basics.tconst, SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', 2), ',', -1) AS genre
    FROM movie_basics
    UNION
    SELECT movie_basics.tconst, SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', 3), ',', -1) AS genre
    FROM movie_basics),

    G AS (
    SELECT C.*, m.primaryTitle AS title, m.titleType, m.startYear, m.runtimeMinutes, r.averageRating
    FROM C
    JOIN movie_basics m ON C.tconst = m.tconst
    JOIN ratings r on m.tconst = r.tconst
    WHERE C.genre IS NOT NULL),

    rs AS(
    SELECT G.tconst, G.title, G.titleType, G.startYear, G.runtimeMinutes, G.genre, G.averageRating, Rank()
    OVER(
    Partition BY G.startYear, G.genre, G.titleType
    ORDER BY G.averageRating DESC) AS rn
    FROM G),


    D AS(
    SELECT crew.tconst, SUBSTRING_INDEX(directors, ',', 1) AS director_id
    FROM crew
    UNION
    SELECT crew.tconst, SUBSTRING_INDEX(SUBSTRING_INDEX(directors, ',', 2), ',', -1) AS director_id
    FROM crew),


    L AS (
    SELECT D.*, nb.primaryName
    FROM D
    JOIN name_basics nb ON D.director_id = nb.nconst
    WHERE D.director_id IS NOT NULL)



    SELECT rs.tconst, rs.title, rs.titleType, rs.startYear, rs.runtimeMinutes, rs.genre, rs.averageRating, dd.director AS directors
    FROM rs
    JOIN (SELECT tconst, GROUP_CONCAT(primaryName) AS director
    FROM L
    GROUP BY tconst) dd
    ON rs.tconst = dd.tconst
    WHERE rs.rn <= 5 and genre = '${genre}' and startYear = ${year};
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}
 
// Route 12: GET /pop_people_media
// complex enough? doesn't make sense
const pop_people_media = async function (req, res){
  const rating_low = req.query.startRating ?? 0;
  const rating_hi = req.query.endRating ?? 10;
  connection.query(`
    SELECT nconst, primaryName, GROUP_CONCAT(primaryTitle SEPARATOR '; ') AS all_shows, GROUP_CONCAT(nconst SEPARATOR '; ') AS all_nconst FROM (
    WITH actorActress AS (
    SELECT p.nconst, p.category, nb.primaryName
    FROM principals p JOIN name_basics nb on p.nconst = nb.nconst WHERE tconst IN(
    SELECT titleId as tconst
    FROM(
    SELECT titleId, COUNT(*) as numArea FROM akas
    GROUP BY titleId
    ) T1
    WHERE numArea >= 1) AND category IN ('actress', 'actor'))
    SELECT A.*, B.tconst, mb.primaryTitle, r.averageRating FROM actorActress A JOIN principals B
    ON A.nconst = B.nconst
    JOIN movie_basics mb on B.tconst = mb.tconst
    JOIN ratings r on mb.tconst = r.tconst WHERE r.averageRating >= ${rating_low} AND r.averageRating <= ${rating_hi}) A GROUP BY primaryName;
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 13: GET /crew/:nconst
const get_crew_info = async function (req, res){
  const nconst = req.params.nconst
  connection.query(`
    SELECT primaryName, birthYear, deathYear, IF(deathYear IS NULL, 2023 - birthYear, deathYear - birthYear) AS age, primaryProfession
    FROM name_basics
    WHERE nconst = '${nconst}';
  `, (err, data) => {
    if(err || data.length === 0){
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 13: GET /search_crew
const search_crew_info = async function (req, res){
  const search_text = req.query.name ?? '';
  const isDead = req.query.dead === 'true' ? 1 : 0;
  const startYear = req.query.startBirthYear ?? 1180
  const endYear = req.query.endBirthYear ?? 2022
  const professions = req.query.professions ?? ''
  let profession1 = ''
  let profession2 = ''
  let profession3 = ''
  professions_split = professions.split(',')
  if(professions_split.length === 1) {
    profession1 = professions_split[0];
  } else if (professions_split.length === 2) {
    profession1 = professions_split[0];
    profession2 = professions_split[1];
  } else if (professions_split.length === 3) {
    profession1 = professions_split[0];
    profession2 = professions_split[1];
    profession3 = professions_split[2];
  } else if (professions_split.length > 3){
    res.json([]);
  } else {
    console.log('no profession');
  }

  if(isDead === 1){
    connection.query(`
      SELECT nconst, primaryName, birthYear, 1 AS dead FROM name_basics
      WHERE primaryProfession LIKE '%${profession1}%' AND primaryProfession LIKE '%${profession2}%' AND primaryProfession LIKE '%${profession3}%'
      AND primaryName LIKE '%${search_text}%'
      AND deathYear IS NOT NULL
      AND birthYear >= ${startYear}
      AND birthYear <= ${endYear};
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
      SELECT nconst, primaryName, birthYear, IF(deathYear IS NULL, 0, 1) AS dead FROM name_basics
      WHERE primaryProfession LIKE '%${profession1}%' AND primaryProfession LIKE '%${profession2}%' AND primaryProfession LIKE '%${profession3}%'
      AND primaryName LIKE '%${search_text}%'
      AND birthYear >= ${startYear}
      AND birthYear <= ${endYear};
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

const get_distinct_professions = async function (req, res){
  connection.query(`
    WITH separate_professions
    AS
    ((SELECT SUBSTRING_INDEX(primaryProfession, ',', 1) AS profession FROM name_basics)
        UNION
    (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(primaryProfession,',', 2), ',',-1) AS profession FROM name_basics)
        UNION
    (SELECT SUBSTRING_INDEX(primaryProfession, ',', -1) AS profession FROM name_basics))
    SELECT distinct(profession) FROM separate_professions WHERE profession IS NOT NULL ORDER BY profession;
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
  search,
  get_type,
  filter_movie,
  get_distinct_genres,
  get_distinct_types,
  get_video_info,
  get_video_crew,
  get_top5,
  get_top1000,
  movie_pop_crew,
  rating_trend,
  pop_people_media,
  get_crew_info,
  get_distinct_professions,
  search_crew_info
}

