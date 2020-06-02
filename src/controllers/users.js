
const userModel = require('../models/users')
const qs = require('querystring')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRounds = 10

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
          msg: 'email has been registered'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'all form must be filled'
      }
      response.status(400).send(data)
    }
  },
  loginUser: async (request, response) => {
    const { email, password } = request.body
    const isExsist = await userModel.getUserByCondition({ email })
    if (isExsist.length > 0) {
      const checkPassword = bcrypt.compareSync(password, isExsist[0].password, (err, res) => {
        return res
      })
      if(checkPassword === true){
        const data = {
          success: true,
          msg: `Hi! ${isExsist[0].name}, Login Sucsess`,
          token: jwt.sign(
            {
              name: isExsist[0].name,
              email
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          )
        }
        response.status(201).send(data)
      } else {
        const data = {
          success: false,
          msg: `password incorrect`
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: `email is not registered`
      }
      response.status(400).send(data)
    }
  },
  updateUser: async (request, response) => {
    const { id } = request.params
    const { name, email, password } = request.body
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
            msg: 'user has been updated',
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
