Promise.deferred = () => {
  let defer = {}
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })

  return defer
}

export default Promise
