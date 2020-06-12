
const genreModel = require('../models/genres')
const moment = require('moment')

const getPage = (_page) => {
  const page = parseInt(_page)
  if (page && page > 0) {
    return page
  } else {
    return 1
  }
}

const getPerPage = (_perPage) => {
  const perPage = parseInt(_perPage)
  if (perPage && perPage > 0) {
    return perPage
  } else {
    return 50
  }
}

const getNextLinkQueryString = (page, totalPage, currentQuery) => {
  page = parseInt(page)
  if (page < totalPage) {
    const generatedPage = {
      page: page + 1
    }
    return qs.stringify({ ...currentQuery, ...generatedPage })
  } else {
    return null
  }
}

const getPrevLinkQueryString = (page, currentQuery) => {
  page = parseInt(page)
  if (page > 1) {
    const generatedPage = {
      page: page - 1
    }
    return qs.stringify({ ...currentQuery, ...generatedPage })
  } else {
    return null
  }
}

module.exports = {
  getAllGenres: async (request, response) => {
    const { page, limit, search, sort } = request.query
    const condition = {
      search,
      sort
    }
    const sliceStart = (getPage(page) * getPerPage(limit)) - getPerPage(limit)
    const sliceEnd = (getPage(page) * getPerPage(limit))
    const totalData = await genreModel.getGenreCount(condition)
    const totalPage = Math.ceil(totalData / getPerPage(limit))
    
    const prevLink = getPrevLinkQueryString(getPage(page), request.query)
    const nextLink = getNextLinkQueryString(getPage(page), totalPage, request.query)

    const genreData = await genreModel.getAllGenres(sliceStart, sliceEnd, condition)
    const data = {
      success: true,
      msg: 'List all genres',
      data:genreData,
      pageInfo: {
        page: getPage(page),
        totalPage,
        perPage: getPerPage(limit),
        totalData,
        nextLink: nextLink && `http:/localhost:1000/genres?${nextLink}`,
        prevLink: prevLink && `http:/localhost:1000/genres?${prevLink}`
      }
    }
    response.status(200).send(data)
  },
  createGenre: async (request, response) => {
    const { genre } = request.body
    if (genre !== '') {
      const isExists = await genreModel.getGenreByCondition({ genre })
      if (isExists.length < 1) {
        const genreData = {
          genre,
          add_date: moment().format('YYYY-MM-DD hh:mm:ss')
        }
        const result = await genreModel.addGenre(genreData)
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
