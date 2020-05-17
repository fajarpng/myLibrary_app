const router = require('express').Router()
const authorsController = require('../controllers/authors')

router.get('/', authorsController.getAllAuthors)
router.post('/', authorsController.addAuthor)
router.patch('/:id', authorsController.updateAuthor)
router.delete('/:id', authorsController.deleteAuthor)

module.exports = router
