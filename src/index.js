const PENDING = 'pending'
const FULLFILLED = 'fullfilled'
const REJECTED = 'rejected'
class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = null
    this.reason = null

    this.onSuccessCallback = []
    this.onErrorCallback = []

    let resolve = val => {
      if (this.status === PENDING) {
        this.value = val
        this.status = FULLFILLED

        this.onSuccessCallback.forEach(f => f())
      }
    }

    let reject = reason => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.onErrorCallback.forEach(f => f())
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  static resolve(value) {
    return new Promise(resolve => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  then(onFullFilled, onRejected) {
    onFullFilled =
      typeof onFullFilled === 'function' ? onFullFilled : val => val
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : e => {
            throw e
          }

    let _promise = new Promise((resolve, reject) => {
      if (this.status === FULLFILLED) {
        setTimeout(() => {
          try {
            let x = onFullFilled(this.value)
            resolvePromise(_promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(_promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === PENDING) {
        this.onSuccessCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onFullFilled(this.value)
              resolvePromise(_promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onErrorCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(_promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })

    return _promise
  }

  static all(promises) {
    return new Promise((resolve, reject) => {
      let arr = []
      let index = 0

      const saveData = (i, data) => {
        arr[i] = data
        if (++index === promises.length) {
          resolve(arr)
        }
      }

      for (let i = 0; i < promises.length; i++) {
        promises[i].then(data => {
          saveData(i, data)
        }, reject)
      }
    })
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(p => p.then(resolve, reject))
    })
  }

  static deferred() {
    let defer = {}
    defer.promise = new Promise((resolve, reject) => {
      defer.resolve = resolve
      defer.reject = reject
    })

    return defer
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('循环调用'))
  }

  let called

  if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          reason => {
            if (called) return
            called = true
            reject(reason)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      else called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

export default Promise
