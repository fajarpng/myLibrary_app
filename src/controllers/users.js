const userModel = require('../models/users')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRounds = 10
const upload = require('../utils/multer')
const profileImg = upload.single('image')

module.exports = {
  getAllUsers: async (request, response) => {
    const userData = await userModel.getAllUser()
    const data = {
      success: true,
      msg: 'List all users',
      data: userData
    }
    response.status(200).send(data)
  },
  createUser: async (request, response) => {
    const { name, email, password, id_role } = request.body
    if (name && email && password && name !== '' && email !== '' && password !== '' && id_role !== '') {
      const isExsist = await userModel.getUserByCondition({ email })
      if (isExsist.length < 1) {
        const userData = {
          name,
          email,
          id_role,
          password: bcrypt.hashSync(password, saltRounds),
          add_date: moment().format('YYYY-MM-DD hh:mm:ss')
        }
        const result = await userModel.createUser(userData)
        if (result) {
          const data = {
            success: true,
            msg: 'User data succesfully created!',
            data: {
              name,
              email,
              id_role,
              add_date: moment().format('YYYY-MM-DD hh:mm:ss')
            }
          }
          response.status(201).send(data)
        } else {
          const data = {
            success: false,
            msg: 'Failed to create user',
            data: request.body
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'Email has been registered !'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'All form must be filled !'
      }
      response.status(400).send(data)
    }
  },
  loginUser: async (request, response) => {
    const { email, password } = request.body
    if(email !== '' && password !== ''){
    const isExsist = await userModel.getUserByCondition({ email })
    if (isExsist.length > 0) {
      const checkPassword = bcrypt.compareSync(password, isExsist[0].password, (err, res) => {
        return res
      })
      if(checkPassword === true){
        const data = {
          success: true,
          msg: `Hi! ${isExsist[0].name}, Login Sucsess`,
          id: isExsist[0].id,
          name: isExsist[0].name,
          image: isExsist[0].image,
          role: isExsist[0].id_role,
          email,
          token: jwt.sign(
            {
              id: isExsist[0].id,
              name: isExsist[0].name,
              role: isExsist[0].id_role,
              email
            },
            process.env.JWT_KEY,
            {
              expiresIn: '12h'
            }
          )
        }
        response.status(201).send(data)
      } else {
        const data = {
          success: false,
          msg: 'Password or username incorrect !'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: `Email is not registered !`
      }
      response.status(400).send(data)
    }
  } else {
      const data = {
        success: false,
        msg: 'All form must be filled !'
      }
      response.status(400).send(data)
    }
  },
  updateImgProfile: async (request,response) => {
    const { id } = request.params
    const fetchUser = await userModel.getUserByCondition({ id: parseInt(id) })
    if (fetchUser.length > 0) {
      profileImg (request, response, async function (error) {
        if ( upload.MulterError || error) {
          return response
            .status(400)
            .json({ success: false, msg: 'only jpeg/jpg/png file, max 2mb'})
        } else {
          const userData = [
            { image: request.file.filename },
            { id: parseInt(id) }
          ]
          const result = await userModel.updateUser(userData)
          if (result) {
            const data = {
              success: true,
                msg: 'Success !, Photo profile updated',
                data: {
                  name: fetchUser[0].name,
                  email: fetchUser[0].email,
                  image: request.file.filename,
                  up_date: moment().format('YYYY-MM-DD hh:mm:ss')
                }
              }
              response.status(200).send(data)
            } else {
              const data = {
                success: false,
                msg: 'failed to update'
              }
              response.status(400).send(data)
            }
        }
      })
    } else {
      const data = {
        success: false,
        msg: `User with id ${id} not found!`
      }
      response.status(400).send(data)
    }
  },
  updateUser: async (request, response) => {
    const { id } = request.params
    const { name, email, password} = request.body
    const fetchUser = await userModel.getUserByCondition({ id: parseInt(id) })
    if (fetchUser.length > 0) {
      if (name && email && password && name !== '' && email !== '' && password !== '') {
        const userData = [
          { name,
            email,
            password: bcrypt.hashSync(password, saltRounds),
            up_date: moment().format('YYYY-MM-DD hh:mm:ss')
          },
          { id: parseInt(id) }
        ]
        const result = await userModel.updateUser(userData)
        if (result) {
          const data = {
            success: true,
            msg: 'User has been updated',
            data: {
              name,
              email,
              up_date: moment().format('YYYY-MM-DD hh:mm:ss')
            }
          }
          response.status(200).send(data)
        } else {
          const data = {
            success: false,
            msg: 'failed to update'
          }
          response.status(400).send(data)
        }
      }
    } else {
      const data = {
        success: false,
        msg: `User with id ${id} not found!`
      }
      response.status(400).send(data)
    }
  },
  deleteUser: async (request, response) => {
    const { id } = request.params
    const _id = { id: parseInt(id) }
    const fetchUser = await userModel.getUserByCondition(_id)
    if (fetchUser.length > 0) {
      const result = await userModel.deleteUser(_id)
      if (result) {
        const data = {
          success: true,
          msg: `User with id ${id} deleted`
        }
        response.status(200).send(data)
      } else {
        const data = {
          success: false,
          msg: 'failed to delete'
        }
        response.status(200).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'Cannot delete data, user not found'
      }
      response.status(400).send(data)
    }
  }
}