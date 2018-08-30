'use strict';

Promise.deferred = function () {
  var defer = {};
  defer.promise = new Promise(function (resolve, reject) {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};

module.exports = Promise;
