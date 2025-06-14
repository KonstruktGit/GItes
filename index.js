const express = require('express');
const path = require('path');

const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', indexRoute);
app.use('/users', usersRoute);

app.listen(port, () => {
  console.log(\Server is running at http://localhost:\\);
});
