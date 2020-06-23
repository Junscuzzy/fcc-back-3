'use strict'

const { ObjectID } = require('mongodb')

function isValidStringId(id) {
  // check for a string of 24 hex characters
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')
  return !!checkForHexRegExp.test(id)
}

module.exports = (app, db) => {
  app
    .route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await db.collection('books').find({}).toArray()
        return res.status(200).json(books || [])
      } catch (error) {
        console.error(error)
        return res.status(200).json([])
      }
    })

    .post((req, res) => {
      const { title } = req.body

      if (!title || title.trim() === '') {
        return res.status(200).json({ message: 'You must specify a title' })
      }
      const book = {
        title,
        commentCount: 0,
        comments: [],
      }

      db.collection('books').insertOne(book, (err, result) => {
        if (err) throw err
        if (result.insertedCount) {
          return res.status(200).json(result.ops[0])
        }
        return res.status(200).json({ message: 'Cannot add the book' })
      })
    })

    .delete((req, res) => {
      db.collection('books').drop({}, (err, delOK) => {
        if (err) throw err
        if (delOK) {
          return res.status(200).json({ message: 'delete successful' })
        } else {
          return res.status(200).json({ message: 'cannot delete' })
        }
      })
    })

  app
    .route('/api/books/:id')
    .get(async (req, res) => {
      const bookId = req.params.id

      if (bookId && isValidStringId(bookId)) {
        const _id = ObjectID(bookId)
        const result = await db.collection('books').findOne({ _id })
        if (result) {
          return res.status(200).json(result)
        }
      }

      return res.status(200).json({ message: 'Book not found' })
    })

    .post(async (req, res) => {
      const bookId = req.params.id
      const { comment } = req.body

      // Has comment
      if (!comment || comment.trim() === '') {
        return res.status(200).json({ message: 'Comment is missing' })
      }

      // Valid _id
      if (!bookId || !isValidStringId(bookId)) {
        return res.status(200).json({ message: 'Book not found' })
      }

      // Get book
      const _id = ObjectID(bookId)
      const result = await db.collection('books').findOne({ _id })

      // book is fund ?
      if (!result) {
        return res.status(200).json({ message: 'Book not found' })
      }

      // Build new book
      const comments = [...result.comments, comment]
      const book = {
        ...result,
        comments,
        commentCount: comments.length,
      }

      // Update book
      const doc = await db.collection('books').findOneAndUpdate({ _id }, book)

      // Success
      if (doc.ok) {
        return res.status(200).json(doc.value)
      }

      // Fail
      return res.status(200).json({ message: 'Book not found' })
    })

    .delete(async (req, res) => {
      const bookId = req.params.id

      // Valid _id
      if (!bookId || !isValidStringId(bookId)) {
        return res.status(200).json({ message: 'Book not found' })
      }

      // Get book
      const _id = ObjectID(bookId)
      const result = await db.collection('books').deleteOne({ _id })

      if (result.deletedCount) {
        return res.status(200).json({ message: 'delete successful' })
      }
      return res.status(200).json({ message: 'Book not found' })
    })
}
