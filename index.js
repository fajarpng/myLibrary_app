require('dotenv').config()
const {APP_PORT} = process.env
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors('*'))
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use('/img', express.static('uploads'))

//import 
const books = require('./src/routes/books')
const users = require('./src/routes/users')
const genres = require('./src/routes/genres')
const authors = require('./src/routes/authors')
const trans = require('./src/routes/trans')

app.use('/books', books)
app.use('/users', users)
app.use('/genres', genres)
app.use('/authors',authors)
app.use('/trans',trans)

app.get('*', (request,response) => {
    response.status(404).send('Page Not found')
})

app.listen (APP_PORT, () => {
   console.log(`CORS-enabled App is listen on ${APP_PORT} port`)
})