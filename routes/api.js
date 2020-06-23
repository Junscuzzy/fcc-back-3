'use strict'

module.exports = (app, db) => {
  app
    .route('/api/books')
    .get((req, res) => {
      // response will be array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post((req, res) => {
      const { title } = req.body
      // response will contain new book object including atleast _id and title
    })

    .delete((req, res) => {
      // if successful response will be 'complete delete successful'
    })

  app
    .route('/api/books/:id')
    .get((req, res) => {
      const bookid = req.params.id
      // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post((req, res) => {
      const bookid = req.params.id
      const { comment } = req.body
      // json res format same as .get
    })

    .delete((req, res) => {
      const bookid = req.params.id
      // if successful response will be 'delete successful'
    })
}
