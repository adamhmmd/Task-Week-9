const express = require("express");
const router = express.Router();
const pool = require("../config.js")
const Limit = 5
const Page = 1


router.get("/users", (req, res, next) => {

  const {limit, page} = req.params

  let responseLimit = limit ? +limit : Limit
  let responsePage = page ? +page : Page

  const getQueryUsers = `
    SELECT
      *
    FROM users
    LIMIT ${responseLimit} OFFSET ${(responsePage-1)*responseLimit}
  `

  pool.query(getQueryUsers, (err, respnose) => {
    
    if(err) next(err)

    res.status(200).json(respnose);
  })

})

module.exports = router