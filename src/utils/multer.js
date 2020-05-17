const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString().concat('_').concat(file.originalname))
  }
})

const fileFilter = (request, file, cb, error) => {
  const checkImage = file.mimetype.toLowerCase()
  if (checkImage === 'image/jpg' || checkImage === 'image/jpeg' || checkImage === 'image/png') {
    cb(null, true)
  } else {
    cb('.jpeg, .jpg or .png only', false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 //2mb
  }
})

module.exports = upload 