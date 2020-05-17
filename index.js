require('dotenv').config()
const {APP_PORT} = process.env
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyparser.urlencoded({extended:false}))
app.use('/img', express.static('uploads'))

app.get('/', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })

//import 
const books = require('./src/routes/books')
const users = require('./src/routes/users')
const genres = require('./src/routes/genres')
const authors = require('./src/routes/authors')

app.use('/books', books)
app.use('/users', users)
app.use('/genres', genres)
app.use('/authors',authors)

app.get('*', (request,response) => {
    response.status(404).send('Page Not found')
})

app.listen (APP_PORT, () => {
   console.log(`CORS-enabled App is listen on ${APP_PORT} port`)
})