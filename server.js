const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//DB Config
const db = require('./config/keys').mongoURI;

//MongoDB Connection
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connection Successful'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Welcome'));

//Passport middleware
require('./config/passport')(passport);


//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

