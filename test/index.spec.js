const { describe, it } = require('mocha')
const { expect } = require('chai')
const Promise = require('../dist/bundle')

describe('promise', () => {
  const promise = new Promise((resolve, reject) => {
    resolve('aaa')
  })

  it('should resolve the promise', done => {
    promise
      .then(res => {
        expect(res).equal('aaa')
      })
      .then(done)
  })

  it('should catch the promise', done => {
    promise
      .then(res => {
        throw new Error('oops')
      })
      .catch(e => {
        expect(e.message).equal('oops')
      })
      .then(done)
  })
})
