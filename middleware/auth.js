const { response } = require("express");
const jwt = require("jsonwebtoken");
const privateKey = "limitedtoken";
const pool = require("../config.js")

function authentication (req, res, next) {

  const {accessToken} = req.headers;

  if (accessToken) {

    const decode = jwt.verify(accessToken, privateKey);
    const {id, email} = decode
    const users = `
      SELECT
        *
      FROM users
      WHERE id = $1
    `
    pool.query(users, [id], (err, result) => {
      if(err) next(err);
      
      if(response.rows.length === 0) {
        next({message: "error, user not found"})
      } else {
        const user = result.rows[0]

        next();
      }
      
    })

  } else {

    next({message: "Authentication failed"})

  }
}

function authorization (req, res, next) {


}

module.exports = {
    authentication,
    authorization
}