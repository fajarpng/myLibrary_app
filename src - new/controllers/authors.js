const authorModel = require('../models/authors')
const qs = require('querystring')
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
  getAllAuthors: async (request, response) => {
    const { page, limit, search, sort } = request.query
    const condition = {
      search,
      sort
    }
    const sliceStart = (getPage(page) * getPerPage(limit)) - getPerPage(limit)
    const sliceEnd = (getPage(page) * getPerPage(limit))
    const totalData = await authorModel.getAuthorCount(condition)
    const totalPage = Math.ceil(totalData / getPerPage(limit))
    

    const prevLink = getPrevLinkQueryString(getPage(page), request.query)
    const nextLink = getNextLinkQueryString(getPage(page), totalPage, request.query)

    const authorData = await authorModel.getAllAuthors(sliceStart, sliceEnd, condition)
    const data = {
      success: true,
      msg: 'List all authors',
      data: authorData,
      pageInfo: {
        page: getPage(page),
        totalPage,
        perPage: getPerPage(limit),
        totalData,
        nextLink: nextLink && `http:/localhost:1000/authors?${nextLink}`,
        prevLink: prevLink && `http:/localhost:1000/authors?${prevLink}`
      }
    }
    response.status(200).send(data)
  },
  addAuthor: async (request, response) => {
    const { author, description } = request.body
    if (description !=='' && author !== '') {
      const isExsist = await authorModel.getAuthorByCondition({ author })
      if (isExsist.length < 1) {
        const authorData = {
          author,
          description,
          add_date: moment().format('YYYY-MM-DD hh:mm:ss')
        }
        const result = await authorModel.addAuthor(authorData)
        if (result) {
          const data = {
            success: true,
            msg: 'author data succesfully added!',
            data: authorData
          }
          response.status(201).send(data)
        } else {
          const data = {
            success: false,
            msg: 'Failed to add author',
            data: request.body
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'author alredy added'
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
  updateAuthor: async (request, response) => {
    const { id } = request.params
    const _id = { id: parseInt(id) }
    const { author, description} = request.body
    const fetchauthor = await authorModel.getAuthorByCondition(_id)
    if (fetchauthor.length > 0) {
      if (author !== '' && description !== '') {
        const authorData = [
          { author,
            description,
            up_date: moment().format('YYYY-MM-DD hh:mm:ss')
          },
          { id: parseInt(id) }
        ]
        const result = await authorModel.updateAuthor(authorData)
        if (result) {
          const data = {
            success: true,
            msg: 'author data updated',
            data: authorData[0]
          }
          response.status(200).send(data)
        } else {
          const data = {
            success: false,
            msg: 'failed to update'
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'All form must be filled!'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: `author with id ${id} not found!`
      }
      response.status(400).send(data)
    }
  },
  deleteAuthor: async (request, response) => {
    const { id } = request.params
    const _id = { id: parseInt(id) }
    const isExsist = await authorModel.getAuthorByCondition(_id)
    if (isExsist.length > 0) {
      const result = await authorModel.deleteAuthor(_id)
      if (result) {
        const data = {
          success: true,
          msg: `author deleted`
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
        msg: `Cannot delete, author not found`
      }
      response.status(400).send(data)
    }
  }
}
