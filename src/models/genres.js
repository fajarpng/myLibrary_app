const db = require('../utils/DB')

module.exports = {
  getAllGenres: (start, end, data = {}) => {
    const sql = `SELECT * FROM genres
      WHERE genre LIKE '${data.search || ''}%' 
      ORDER BY genre ${parseInt(data.sort) ? 'DESC' : 'ASC'} 
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
  addGenre: (data) => {
    const sql = 'INSERT INTO genres SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result.insertId)
      })
    })
  },
  getGenreCount: (data = {}) => {
    const sql = `SELECT COUNT(*) as total 
      FROM genres
      WHERE genre LIKE '${data.search || ''}%'`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result[0].total)
      })
    })
  },
  getGenreByCondition: (data) => {
    const sql = 'SELECT * FROM genres WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  updateGenre: (data) => {
    const sql = 'UPDATE genres SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result.affectedRows)
      })
    })
  },
  deleteGenre: (data) => {
    const sql = 'DELETE FROM genres WHERE ?'
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