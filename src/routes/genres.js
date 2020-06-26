const router = require('express').Router()
const genresController = require('../controllers/genres')
const verifyToken = require('../utils/authentication')

router.get('/', genresController.getAllGenres)
router.use(verifyToken)
router.post('/', genresController.createGenre)
router.patch('/:id', genresController.updateGenre)
router.delete('/:id', genresController.deleteGenre)

module.exports = router
