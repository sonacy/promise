'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var PENDING = 'pending';
var FULLFILLED = 'fullfilled';
var REJECTED = 'rejected';

var Promise$1 =
/*#__PURE__*/
function () {
  function Promise(executor) {
    var _this = this;

    _classCallCheck(this, Promise);

    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.onSuccessCallback = [];
    this.onErrorCallback = [];

    var resolve = function resolve(val) {
      if (_this.status === PENDING) {
        _this.value = val;
        _this.status = FULLFILLED;

        _this.onSuccessCallback.forEach(function (f) {
          return f();
        });
      }
    };

    var reject = function reject(reason) {
      if (_this.status === PENDING) {
        _this.reason = reason;
        _this.status = REJECTED;

        _this.onErrorCallback.forEach(function (f) {
          return f();
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  _createClass(Promise, [{
    key: "catch",
    value: function _catch(onRejected) {
      return this.then(null, onRejected);
    }
  }, {
    key: "then",
    value: function then(onFullFilled, onRejected) {
      var _this2 = this;

      onFullFilled = typeof onFullFilled === 'function' ? onFullFilled : function (val) {
        return val;
      };
      onRejected = typeof onRejected === 'function' ? onRejected : function (e) {
        throw e;
      };

      var _promise = new Promise(function (resolve, reject) {
        if (_this2.status === FULLFILLED) {
          setTimeout(function () {
            try {
              var x = onFullFilled(_this2.value);
              resolvePromise(_promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        }

        if (_this2.status === REJECTED) {
          setTimeout(function () {
            try {
              var x = onRejected(_this2.reason);
              resolvePromise(_promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        }

        if (_this2.status === PENDING) {
          _this2.onSuccessCallback.push(function () {
            setTimeout(function () {
              try {
                var x = onFullFilled(_this2.value);
                resolvePromise(_promise, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });

          _this2.onErrorCallback.push(function () {
            setTimeout(function () {
              try {
                var x = onRejected(_this2.reason);
                resolvePromise(_promise, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
        }
      });

      return _promise;
    }
  }], [{
    key: "resolve",
    value: function resolve(value) {
      return new Promise(function (resolve) {
        resolve(value);
      });
    }
  }, {
    key: "reject",
    value: function reject(reason) {
      return new Promise(function (resolve, reject) {
        reject(reason);
      });
    }
  }, {
    key: "all",
    value: function all(promises) {
      return new Promise(function (resolve, reject) {
        var arr = [];
        var index = 0;

        var saveData = function saveData(i, data) {
          arr[i] = data;

          if (++index === promises.length) {
            resolve(arr);
          }
        };

        var _loop = function _loop(i) {
          promises[i].then(function (data) {
            saveData(i, data);
          }, reject);
        };

        for (var i = 0; i < promises.length; i++) {
          _loop(i);
        }
      });
    }
  }, {
    key: "race",
    value: function race(promises) {
      return new Promise(function (resolve, reject) {
        promises.forEach(function (p) {
          return p.then(resolve, reject);
        });
      });
    }
  }, {
    key: "deferred",
    value: function deferred() {
      var defer = {};
      defer.promise = new Promise(function (resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
      });
      return defer;
    }
  }]);

  return Promise;
}();

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('循环调用'));
  }

  var called;

  if (x !== null && (typeof x === 'function' || _typeof(x) === 'object')) {
    try {
      var then = x.then;

      if (typeof then === 'function') {
        then.call(x, function (y) {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, function (reason) {
          if (called) return;
          called = true;
          reject(reason);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;else called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

module.exports = Promise$1;
