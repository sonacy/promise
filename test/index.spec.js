const { describe, it } = require('mocha')
const { expect } = require('chai')
const Promise = require('../dist/bundle')

describe('promise', () => {
  it('init promise with resolve and reject', done => {
    new Promise((resolve, reject) => {
      resolve('haha')
    })
      .then(res => {
        expect(res).equal('haha')
      })
      .then(done)
  })
})
