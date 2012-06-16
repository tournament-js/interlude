var slice = Array.prototype.slice
  , hasOwnProp = Object.prototype.hasOwnProperty
  , $ = require('operators');

// ---------------------------------------------
// Functional Helpers
// ---------------------------------------------
$.id = function (x) {
  return x;
};

$.noop = function () {
};

$.constant = function (val) {
  return function () {
    return val;
  };
};

// if using object as a hash, use this for security
// but preferably set hash = Object.create(null)
// and simply test for !!hash[key]
$.has = function (obj, key) {
  return hasOwnProp.call(obj, key);
};

// can sometimes be useful to compose with
$.not = function (fn) {
  return function (x) {
    return !fn(x);
  };
};

// any/all/none are more useful as fn currying for every/some than unlifting and/or
$.all = function (fn) {
  return function (xs) {
    return xs.every(fn);
  };
};

$.any = function (fn) {
  return function (xs) {
    return xs.some(fn);
  };
};

$.none = function (fn) {
  return function (xs) {
    return !xs.some(fn);
  };
};

$.elem = function (xs) {
  return function (x) {
    return xs.indexOf(x) >= 0;
  };
};

$.notElem = function (xs) {
  return function (x) {
    return xs.indexOf(x) < 0;
  };
};

// ---------------------------------------------
// Math
// ---------------------------------------------

$.gcd = function (a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    var temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

$.lcm = function (a, b) {
  return (!a || !b) ? 0 : Math.abs((a * b) / $.gcd(a, b));
};

$.even = function (n) {
  return n % 2 === 0;
};

$.odd = function (n) {
  return n % 2 === 1;
};

// two curried versions
$.pow = function (exponent) {
  return function (x) {
    return Math.pow(x, exponent);
  };
};

$.logBase = function (base) {
  return function (x) {
    return Math.log(x) / Math.log(base);
  };
};

$.log2 = $.logBase(2);

// ---------------------------------------------
// Property accessors
// ---------------------------------------------

$.get = function (prop) {
  return function (el) {
    return el[prop];
  };
};

$.getDeep = function (str) {
  var props = str.split('.')
    , len = props.length;
  return function (el) {
    var pos = el;
    for (var i = 0; i < len; i += 1) {
      pos = pos[props[i]];
      if (pos === undefined) {
        return;
      }
    }
    return pos;
  };
};

// property accessor map -- equivalent to _.pluck or xs.map($.get('prop'))
$.pluck = function (prop, xs) {
  var result = [];
  for (var i = 0, len = xs.length; i < len; i += 1) {
    result[i] = xs[i][prop];
  }
  return result;
};

// first/last + generalized
$.first = function (xs) {
  return xs[0];
};

$.last = function (xs) {
  return xs[xs.length - 1];
};

$.firstBy = function (fn, xs) {
  for (var i = 0, len = xs.length; i < len; i += 1) {
    if (fn(xs[i])) {
      return xs[i];
    }
  }
  return undefined;
};

$.lastBy = function (fn, xs) {
  for (var i = xs.length - 1; i >= 0; i -= 1) {
    if (fn(xs[i])) {
      return xs[i];
    }
  }
  return undefined;
};

// ---------------------------------------------
// Higher order looping
// ---------------------------------------------

// enumerate the first n positive integers
// like _.range or python's range, but 1-indexed inclusive
$.range = function (start, stop, step) {
  if (arguments.length <= 1) {
    stop = start;
    start = 1;
  }
  step = arguments[2] || 1;
  var len = Math.max(Math.ceil((stop - start + 1) / step), 0)
    , range = new Array(len);

  for (var i = 0; i < len; i += 1, start += step) {
    range[i] = start;
  }
  return range;
};

$.replicate = function (num, el) {
  var result = [];
  for (var i = 0; i < num; i += 1) {
    result.push(el);
  }
  return result;
};

// can act as zipWith, zipWith3, zipWith4...
// zipper function must have the same number of arguments as there are lists
// but beyond that, it's very dynamic
$.zipWith = function () {
  var fn = arguments[0]
    , args = slice.call(arguments, 1)
    , numLists = args.length
    , results = []
    , len = $.minimum($.pluck('length', args));

  for (var i = 0; i < len; i += 1) {
    var els = [];
    for (var j = 0; j < numLists; j += 1) {
      els.push(args[j][i]);
    }
    results.push(fn.apply(null, els));
  }
  return results;
};

// zip, zip3, zip4.. all in one!
// inlining quite a bit faster: http://jsperf.com/inlinezip3
// then not slicing helps too: http://jsperf.com/tosliceornottoslice5
$.zip = function () {
  var numLists = arguments.length
    , results = []
    , len = $.minimum($.pluck('length', arguments));

  for (var i = 0; i < len; i += 1) {
    var els = [];
    for (var j = 0; j < numLists; j += 1) {
      els.push(arguments[j][i]);
    }
    results.push(els);
  }
  return results;
};

$.iterate = function (times, init, fn) {
  var result = [init];
  for (var i = 1; i < times; i += 1) {
    result.push(fn(result[i - 1]));
  }
  return result;
};

// scan(fn, z)([x1, x2, ...]) == [z, f(z, x1), f(f(z, x1), x2), ...]
$.scan = function (xs, fn, initial) {
  var result = [initial];
  for (var i = 0, len = xs.length ; i < len; i += 1) {
    result.push(fn(result[i], xs[i]));
  }
  return result;
};


// these need only curried versions, as immediate use could simply access prototype on xs
$.reduce = function (fn, initial) {
  return function (xs) {
    return xs.reduce(fn, initial);
  };
};

$.map = function (fn) {
  return function (xs) {
    return xs.map(fn);
  };
};

$.filter = function (fn) {
  return function (xs) {
    return xs.filter(fn);
  };
};

// general accessor for anything else
// more cumbersome but can do most things well
$.invoke = function (method) {
  var args = slice.call(arguments, 1);
  return function (xs) {
    var fn = xs[method];
    return fn.apply(xs, args);
  };
};


// ---------------------------------------------
// Functional Sequencing (Composition)
// ---------------------------------------------

// $.seq(f1, f2, f3..., fn)(args...) == fn(...(f3(f2(f1(args...)))))
// performance: http://jsperf.com/seqperformance
$.seq = function () {
  var fns = arguments;
  return function () {
    // only need to apply the first with initial args
    var res = fns[0].apply(this, arguments);
    for (var i = 1, len = fns.length; i < len; i += 1) {
      res = fns[i](res); // rest chain in result from previous
    }
    return res;
  };
};

// more efficient functional sequencers
$.seq2 = function (f, g) {
  return function (x, y, z, w) {
    return g(f(x, y, z, w));
  };
};

$.seq3 = function (f, g, h) {
  return function (x, y, z, w) {
    return h(g(f(x, y, z, w)));
  };
};

$.seq4 = function (f, g, h, k) {
  return function (x, y, z, w) {
    return k(h(g(f(x, y, z, w))));
  };
};

// ---------------------------------------------
// Function Wrappers
// ---------------------------------------------

// Memoize an expensive function by storing its results in a proper hash.
$.memoize = function (fn, hasher) {
  var memo = Object.create(null);
  hasher = hasher || $.id;
  return function () {
    var key = hasher.apply(this, arguments);
    if (!memo[key]) {
      memo[key] = fn.apply(this, arguments);
    }
    return memo[key];
  };
};

$.once = function (fn) {
  var done = false, result;
  return function () {
    if (!done) {
      done = true;
      result = fn.apply(this, arguments);
    }
    return result;
  };
};

// debug function, wrap it in a function reporting its scope and arguments
// particularly useful when combined with $.iterate
$.trace = function (fn, log) {
  log = log || console.log;
  return function () {
    var result = fn.apply(this, arguments);
    log('(' + slice.call(arguments, 0).join(', ') + ') -> ', result);
    return result;
  };
};

$.traceBy = function (fn, via) {
  return function () {
    var result = fn.apply(this, arguments);
    via(slice.call(arguments, 0), result);
    return result;
  };
};

// _.wrap, passes to a callback of form (fn, args..)
// can log arguments and return, but should return fn.apply(args) to work unobtrusively
$.wrap = function (fn, wrapper) {
  return function () {
    return wrapper.apply(this, [fn].concat(slice.call(arguments, 0)));
  };
};

// unsure about these
/*

// guard a function by a condition function
// returns a function that will only apply f(x) if cond(x) is true
$.guard = function (fn, cond) {
  return function (x) {
    return (cond(x)) ? fn(x) : null;
  };
};

// var guardedFibonacci = $.guard(fibonacci, lt(100));

// $.either null guard a function, else return errorFn result
// if errorFn is a logger, then curry it with the required message
$.either = function (guardedFn, errorFn) {
  return function (x) {
    var result = guardedFn(x);
    return (result === null) ? errorFn(x) : result;
  };
};

// var errorMsg;
// var cpuSafeFibonacci = $.either(guardedFibonacci, $.constant(errorMsg));
// or
// var cpuSafeFibonaci = $.either(guardedFibonacci, $.curry(console.log, errorMsg))
*/

//$.extend

//TODO: throttle, debounce


//TODO: clone, extend, deepEqual (although not in this section!, maybe get these from somewhere)



// end - export

// re-export subset
var subset = require('subset')
Object.keys(subset).forEach(function (key) {
  $[key] = subset[key];
});
module.exports = $;
