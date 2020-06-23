const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', () => {
  suite('Routing tests', () => {
    suite(
      'POST /api/books with title => create book object/expect book object',
      () => {
        test('Test POST /api/books with title', done => {
          chai
            .request(server)
            .post('/api/books')
            .send({ title: 'My super book' })
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.status, 200)
              assert.equal(res.body.title, 'My super book')
              assert.property(res.body, '_id')
              assert.property(res.body, 'commentCount')
              assert.property(res.body, 'comments')
              done()
            })
        })

        test('Test POST /api/books with no title given', done => {
          chai
            .request(server)
            .post('/api/books')
            .send({})
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.status, 200)
              assert.equal(res.body.message, 'You must specify a title')
              done()
            })
        })
      },
    )

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', done => {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            if (err) throw err
            assert.equal(res.status, 200)
            assert.isArray(res.body, 'response should be an array')
            assert.property(
              res.body[0],
              'title',
              'Books in array should contain title',
            )
            done()
          })
      })
    })

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', done => {
        chai
          .request(server)
          .get('/api/books/3ef1d6f86de4a41f6dac84c2')
          .end((err, res) => {
            if (err) throw err
            assert.equal(res.status, 200)
            assert.equal(res.body.message, 'Book not found')
            done()
          })
      })

      test('Test GET /api/books/[id] with valid id in db', done => {
        chai
          .request(server)
          .get('/api/books/5ef1e0c68eaab8382e95e568')
          .end((err, res) => {
            if (err) throw err
            assert.equal(res.status, 200)
            assert.property(res.body, 'title')
            assert.isNumber(res.body.commentCount)
            assert.isArray(res.body.comments)
            done()
          })
      })
    })

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      () => {
        test('Test POST /api/books/[id] with comment', done => {
          chai
            .request(server)
            .post('/api/books/5ef1e0c68eaab8382e95e568')
            .send({ comment: 'Hello world' })
            .end((err, res) => {
              if (err) throw err
              assert.equal(res.status, 200)
              assert.property(res.body, 'title')
              assert.isNumber(res.body.commentCount)
              assert.isArray(res.body.comments)
              assert.equal(res.body.comments[0], 'Hello world')
              done()
            })
        })
      },
    )

    suite('DELETE /api/books/[id] => message', () => {
      test('Test DELETE /api/books/[id]', done => {
        chai
          .request(server)
          .delete('/api/books/5ef1e1c99029df38fa7f0a82')
          .end((err, res) => {
            if (err) throw err
            assert.equal(res.status, 200)
            assert.equal(res.body.message, 'delete successful')
            done()
          })
      })
    })

    suite('DELETE /api/books/ => message', () => {
      test('Test DELETE /api/books/', done => {
        chai
          .request(server)
          .delete('/api/books')
          .end((err, res) => {
            if (err) throw err
            assert.equal(res.status, 200)
            assert.equal(res.body.message, 'delete successful')
            done()
          })
      })
    })
  })
})
