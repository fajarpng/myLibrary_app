const router = require('express').Router()
const transController = require('../controllers/trans')
const verifyToken = require('../utils/authentication')

router.get('/', transController.getAllTrans)
router.get('/:id', transController.getUserTrans)
router.use(verifyToken)
router.post('/', transController.createTrans)
router.delete('/:id', transController.deleteTrans)

module.exports = router