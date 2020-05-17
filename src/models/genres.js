const db = require('../utils/DB')

module.exports = {
  createGenre: (data) => {
    const sql = 'INSERT INTO genres SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        console.log(result)
        resolve(result.insertId)
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
