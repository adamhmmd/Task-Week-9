const express = require('express');
const app = express();
const port = 3000;
const router = require("./routing/index.js");
const swaggerUi = require('swagger-ui-express')
const moviejson = require("./movie.json")
const morgan = require("morgan")

app.use(morgan('tiny'));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(moviejson));
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 