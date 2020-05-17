
const genreModel = require('../models/genres')
const moment = require('moment')

module.exports = {
  createGenre: async (request, response) => {
    const { genre } = request.body
    if (genre &&  genre !== '') {
      const isExists = await genreModel.getGenreByCondition({ genre })
      if (isExists.length < 1) {
        const genreData = {
          genre,
          add_date: moment().format('YYYY-MM-DD hh:mm:ss')
        }
        const result = await genreModel.createGenre(genreData)
        if (result) {
          const data = {
            success: true,
            msg: 'Genre data succesfully created!',
            data: genreData
          }
          response.status(201).send(data)
        } else {
          const data = {
            success: false,
            msg: 'Failed to create genre',
            data: request.body
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'genre alredy exsist'
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
  updateGenre: async (request, response) => {
    const { id } = request.params
    const { genre } = request.body
    const fetchGenre = await genreModel.getGenreByCondition({ id: parseInt(id) })
    if (fetchGenre.length > 0) {
      if (genre && genre !== '') {
        const genreData = [
          { genre,
            up_date: moment().format('YYYY-MM-DD hh:mm:ss')
          },
          { id: parseInt(id) }
        ]
        const result = await genreModel.updateGenre(genreData)
        if (result) {
          const data = {
            success: true,
            msg: 'genre has been updated',
            data: genreData[0]
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
        msg: `genre with id ${request.params.id} not found!`
      }
      response.status(400).send(data)
    }
  },
  deleteGenre: async (request, response) => {
    const { id } = request.params
    const _id = { id: parseInt(id) }
    const fetchGenre = await genreModel.getGenreByCondition(_id)
    if (fetchGenre.length > 0) {
      const result = await genreModel.deleteGenre(_id)
      if (result) {
        const data = {
          success: true,
          msg: `Genre ${fetchGenre[0].name} deleted`
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
        msg: 'Cannot delete data, genre not found'
      }
      response.status(400).send(data)
    }
  }
}
