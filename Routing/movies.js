const express = require("express");
const router = express.Router();
const pool = require("../config.js")
const {authorization} = require("../middleware/auth.js")
const Limit = 5
const Page = 1


//GET Queries + Pagination

router.get("/movies", authorization, (req, res, next) => {

  const {limit, page} = req.params

  let responseLimit = limit ? +limit : Limit
  let responsePage = page ? +page : Page

  const getQuery = `
    SELECT
      *
    FROM movies
    LIMIT ${responseLimit} OFFSET ${(responsePage-1)*responseLimit}
  `

  pool.query(getQuery, (err, respnose) => {
    
    if(err) next(err)

    res.status(200).json(respnose);
  })

})

router.get("/movies/:id", (req, res, next) => {
  
  const id = req.params.id

  const getIdQuery = `
  SELECT 
  * 
  FROM movies
    WHERE id = ${id}`

  pool.query(getIdQuery, (err, response) => {

    if(err) next(err)
    
    res.status(200).json(response)
  })
})

//POST Query

router.post("/movies", (req, res, next) => {
  
  const {title, genres, year} = req.body
  
  const postQuery =`
    INSERT INTO movies (title, genres, year)
      VALUES
      ($1, $2, $3);
  `  
  pool.query(postQuery, [title, genres, year], (err, response) =>{
    
    if(err) next(err)

    res.status(200).json(response)
  })
})

//PUT Query

router.put("/movies/:id", (req, res, next) => {

  const id = req.params.id;
  const {title, genres, year} = req.body;

  const putQuery = `
    UPDATE movies
    SET title = $1,
        genres = $2,
        year = $3,
    WHERE id = $4;
  `

  pool.query(putQuery, [title, genres, year, id], (err, response) => {

    if(err) next(err)

    res.status(200).json(response)
  })

})

//DELETE Query

router.delete("/movies/:id", (req, res, next) => {

  const id = req.params.id

  const deleteQuery = `
  
    DELETE FROM movies
    WHERE id = $1;
  `
  pool.query(deleteQuery, [id], (err, response) => {
    
    if(err) next(err)
    
    res.status(200).json(response)
  })

})

module.exports = router;