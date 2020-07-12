const router = require('express').Router()
const usersController = require('../controllers/users')

router.get('/', usersController.getAllUsers)
router.post('/login', usersController.loginUser)
router.post('/', usersController.createUser)
router.patch('/:id', usersController.updateUser)
router.patch('/photo/:id', usersController.updateImgProfile)
router.delete('/:id', usersController.deleteUser)

module.exports = router
