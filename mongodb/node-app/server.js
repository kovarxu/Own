const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// users.js
const users = require('./routes/api/users');

// DB config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose.connect(db)
  .then(() => console.log('mongoose connect ready.'))
  .catch(e => console.log(e));
;

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use routes
app.use('/api/users', users);

const port = process.env.PORT || 5555;

app.get('/', (req, res) => {
  res.send('Hello world!');
})

app.listen(port, () => {
  console.log('server is running on port ' + port);
})
