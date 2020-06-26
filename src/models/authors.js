const db = require('../utils/DB')

module.exports = {
  getAllAuthors: (start, end, data = {}) => {
    const sql = `SELECT * FROM authors
      WHERE author LIKE '${data.search || ''}%' 
      ORDER BY author ${parseInt(data.sort) ? 'DESC' : 'ASC'} 
      LIMIT ${end} OFFSET ${start}`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  getAuthorCount: (data = {}) => {
    const sql = `SELECT COUNT(*) as total 
      FROM authors 
      WHERE author LIKE '${data.search || ''}%'`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result[0].total)
      })
    })
  },
  addAuthor: (data) => {
    const sql = 'INSERT INTO authors SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result.insertId)
      })
    })
  },
  getAuthorByCondition: (data) => {
    const sql = 'SELECT * FROM authors WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  updateAuthor: (data) => {
    const sql = 'UPDATE authors SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result.affectedRows)
      })
    })
  },
  deleteAuthor: (data) => {
    const sql = 'DELETE FROM authors WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result.affectedRows)
      })
    })
  }
}
