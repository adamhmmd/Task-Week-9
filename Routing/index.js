const express = require("express");
const router = express.Router();
const moviesRouter = require("./movies.js");
const usersRouter = require("./users.js");
const pool = require("../config.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const privateKey = "limitedtoken";
const {authentication} = require("../middleware/auth.js");

router.post("/login", (req, res, next) => {
  
  const {email, password} = req.body

  const login = `
  
    SELECT
    *
    FROM users
    WHERE email = $1

  `

  pool.query(login, [email], (err, response) => {
    
    if(err) next(err)

    if(response.rows.length === 0) {
      next({message : "error, password not found"})
    } else {
      const data = response.rows[0] 
      const compare = bcrypt.compareSync(password,data.password)

      if(compare){

        const token = jwt.sign({
          id: data.id,
          email : data.email
        }, privateKey)

        res.status(200).json({
          id: data.id,
          email: data.email,
          token : token
        })

      } else {
        next({message : "error, wrong password"})
      }
    }
  })

})

router.post("/regiter", (req, res, next) => {

  const {email, gender, password, role} = req.body
  const hash = bcrypt.hashSync(password, salt);
  const register = `

    INSERT INTO users (email, gender, password, role)
      VALUES
      ($1, $2, $3, $4);

  `
  pool.query(register, [email, gender, password, role], (err, response) => {
    if(err) next(err)

    res.status(200).json(response)
  })

})

router.use(authentication)
router.use("/", moviesRouter)
router.use("/", usersRouter)
module.exports = router;