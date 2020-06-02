const db = require('../utils/DB')

module.exports = {
  getAllBooks: (start, end, data = {}) => {
    const sql = `
      SELECT books.id, books.title, books.image, books.description, genres.genre, book_status.status, authors.author 
      FROM books
      INNER JOIN genres ON books.id_genre = genres.id
      INNER JOIN book_status ON books.id_status = book_status.id
      INNER JOIN authors ON books.id_author = authors.id
      WHERE books.title LIKE '${data.search || ''}%' 
      ORDER BY books.title ${parseInt(data.sort) ? 'DESC' : 'ASC'} 
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
  getBookCount: (data = {}) => {
    const sql = `SELECT COUNT(*) as total 
      FROM books 
      WHERE title LIKE '${data.search || ''}%' 
      ORDER BY title ${parseInt(data.sort) ? 'DESC' : 'ASC'}`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result[0].total)
      })
    })
  },
  addBook: (data) => {
    const sql = 'INSERT INTO books SET ?'
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
  getBookByCondition: (data) => {
    const sql = `SELECT * FROM books WHERE ?`
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result)
      })
    })
  },
  updateBook: (data) => {
    const sql = 'UPDATE books SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(Error(error))
        }
        resolve(result.affectedRows)
      })
    })
  },
  deleteBook: (data) => {
    const sql = 'DELETE FROM books WHERE ?'
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
