const transModel = require('../models/trans')
const bookModel = require('../models/books')
const userModel = require('../models/users')
const moment = require('moment')

module.exports = {
    getAllTrans: async (request, response) => {
        const transData = await transModel.getAllTrans()
        const data = {
          success: true,
          msg: 'List all transactions',
          data: transData
        }
        response.status(200).send(data)
    },
    getUserTrans: async (request, response) => {
        const { id } = request.params
        const _id = { id_user: parseInt(id) }
        const data = await transModel.getTransByCondition( _id)
        if (data.length > 0) {
            const data = {
                success: true,
                msg: `List user ${id} transactions`,
                data: {data
                }
            }
            response.status(200).send(data)
        }   else {
                const data = {
                    success: false,
                    msg: `Transaction not found`
                }
                response.status(400).send(data)
            }
    },
    createTrans: async (request, response) => {
        const { id_user, id_book } = request.body
        if (id_user !== '' && id_book !== '') {
          const isAvail = await bookModel.getBookByCondition({ id: parseInt(id_book)})
          if (isAvail[0].id_status === 1) {
            const transData = {
              id_book,
              id_user,
              add_date: moment().format('YYYY-MM-DD hh:mm:ss')
            }
            const result = await transModel.addTrans(transData)
            if (result) {
                const upStatus = [
                    { id_status: 2 },
                    { id: parseInt(id_book) }
                ]
                await bookModel.updateBook(upStatus)
                const data = {
                    success: true,
                    msg: 'Success, Happy reading!',
                    data: {
                    transData
                    }
                }
                response.status(201).send(data)
            } else {
              const data = {
                success: false,
                msg: 'Failed to borrow',
                data: request.body
              }
              response.status(400).send(data)
            }
          } else {
            const data = {
              success: false,
              msg: 'Book is not available'
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
    deleteTrans: async (request, response) => {
        const { id } = request.params
        const _id = { id: parseInt(id) }
        const isExsist = await transModel.getTransByCondition( _id)
        if (isExsist.length > 0) {
          const result = await transModel.deleteTrans(_id)
          if (result) {
            const upStatus = [
                { id_status: 1 },
                { id: parseInt(isExsist[0].id_book) }
            ]
            await bookModel.updateBook(upStatus)
            const data = {
              success: true,
              msg: `Book returned`
            }
            response.status(200).send(data)
          } else {
            const data = {
              success: false,
              msg: 'failed to delete'
            }
            response.status(400).send(data)
          }
        } else {
          const data = {
            success: false,
            msg: `Cannot delete, Transaction not found`
          }
          response.status(400).send(data)
        }
    }
}