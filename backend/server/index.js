const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const database = require('../config/database'); 

app.use(cors());

app.use(bodyParser.json());

const routes = require('../routes/index')
app.use('/', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
