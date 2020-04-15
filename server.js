'use strict';

require('dotenv').config();

//app dependencies

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

//app setup

const app = express();
const PORT = process.env.PORT || 5500;

//app middleware

app.use(express).urlencoded({extended:true});
app.use(express.static('public'));

//set view engine for server-side templating

app.set('view engine', 'ejs');

//api routes
//renders search form
app.get('/', (req, res) => {
  res.render('pages/index')
});

app.get('/', showHomepage);
app.get('/searches', showSearch);
app.post('/books', submitBook);
app.post('/books/:id', showBook);

//create a new search to the google books api or whatnot
app.post('/searches', createSearch);
