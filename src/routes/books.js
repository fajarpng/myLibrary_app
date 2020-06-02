const router = require('express').Router()
const booksController = require('../controllers/books')
const verifyToken = require('../utils/authentication')

router.use(verifyToken)
router.get('/', booksController.getAllBooks)
router.post('/', booksController.addBook)
router.patch('/:id', booksController.updateBook)
router.delete('/:id', booksController.deleteBook)

module.exports = router
