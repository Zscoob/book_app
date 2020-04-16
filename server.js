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

//a catch all
app.get('*', send404);

app.listen(PORT, ()=> console.log(`Listening on port: ${PORT}, Baby!`));)

//book function
function Book(book){
this.title = book.title ? book.title : 'no title available';
this.author = book.authors ? book.authors : 'no authors available';
this.description = book.description ? book.description : 'no description available';
this.image = book.imageLinks ? book.imageLinks.thumbnail.replace(/^http/, 'https') : null;
this.isbn = book.industryIdentifiers ? book.industryIdentifiers[0].identifier : 'We cant find the ISBN...';
}

//error handling
function handleError(res, err, status = 500) {
  res.render('pages/error',{status:status, err: err.message});
}

function getErrorHandler(res,status = 500) {
  return (error) => handleError(res,error,status);
}

//show stuff
function showSearch(req,res) {
  res.render('pages/searches')
}

function showHomepage(req,res) {
  client.query('SELECT * FROM books;').then(books => {
    res.render('pages/homepage',{books:books.rows});
  }).catch(getErrorHandler(res));
}

function showBook (req, res){
  req.body.id = req.params.id;
  res.render('pages/bookview', {book:req.body});
}

//submit dat shit
function submitBook(req,res){
  try {
    const sql = 'INSERT INTO books (title,author,image,description,bookshelf) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;';
    const values = [req.body.title, req.body.author, req.body.isbn, req.body.image, req.body.description, req.body.bookshelf];
    client.query(sql,values).then((sqlResponse)=>{
      const sql = 'SELECT * FROM books WHERE id=$1';
      client.query(sql, [sqlResponse.rows[0].id]).then((sqlResponse)=> {
      console.log(sqlResponse);
      res.render('pages/bookview', {book: sqlResponse.rows[0] });
      }).catch(getErrorHandler(res));
    }).catch(getErrorHandler(res));
  } catch (error) {
    handleError(res,error);
   }
 }

//404 
function send404(req,res) {
  res.status(404).send('sorry bud.. you dont even exist brah.');
}

//search the api
function createSearch(req, res){
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
console.log(req.body);
console.log(req.body.search);
if (req.body.search[1] === 'title') { url += `intitle: ${req.body.search[0]}`; }
if (req.body.search[1] === 'author') { url += `inauthor: ${req.body.search[0]}`; }

superagent.get(url)
 .then(apiResponse => {

 })
}
