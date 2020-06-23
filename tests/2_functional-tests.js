const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', () => {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', done => {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        if (err) throw err
        assert.equal(res.status, 200)
        assert.isArray(res.body, 'response should be an array')
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount',
        )
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title',
        )
        assert.property(res.body[0], '_id', 'Books in array should contain _id')
        done()
      })
  })
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', () => {
    suite(
      'POST /api/books with title => create book object/expect book object',
      () => {
        test('Test POST /api/books with title', done => {
          // done();
        })

        test('Test POST /api/books with no title given', done => {
          // done();
        })
      },
    )

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', done => {
        // done();
      })
    })

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', done => {
        // done();
      })

      test('Test GET /api/books/[id] with valid id in db', done => {
        // done();
      })
    })

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      () => {
        test('Test POST /api/books/[id] with comment', done => {
          // done();
        })
      },
    )
  })
})
