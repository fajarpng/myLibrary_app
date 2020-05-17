const router = require('express').Router()
const genresController = require('../controllers/genres')

router.post('/', genresController.createGenre)
router.patch('/:id', genresController.updateGenre)
router.delete('/:id', genresController.deleteGenre)

module.exports = router
