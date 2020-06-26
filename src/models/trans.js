const db = require('../utils/DB')

module.exports = {
  getAllTrans: () => {
    const sql = `SELECT transction.id, books.title, users.name 
    FROM transction
    INNER JOIN books ON books.id = transction.id_book
    INNER JOIN users ON users.id = transction.id_user`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  addTrans: (data) => {
    const sql = `INSERT INTO transction SET ?`
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result.insertId)
      })
    })
  },
  getTransByCondition: (data) => {
    const sql = 'SELECT * FROM transction WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  updateTrans: (data) => {
    const sql = 'UPDATE transction SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result.affectedRows)
      })
    })
  },
  deleteTrans: (data) => {
    const sql = 'DELETE FROM transction WHERE ?'
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