var slice = Array.prototype.slice
  , hasOwnProp = Object.prototype.hasOwnProperty
  , $ = {};

// common
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

// curried helper functions for common operations
$.plus = function (x) {
  return function (y) {
    return y + x;
  };
};

$.subtract = function (x) {
  return function (y) {
    return y - x;
  };
};

$.times = function (x) {
  return function (y) {
    return y * x;
  };
};

$.divide = function (x) {
  return function (y){
    return y / x;
  };
};

$.append = function (xs) {
  return function (ys) {
    return ys.concat(xs);
  };
};

$.prepend = function (xs) {
  return function (ys) {
    return xs.concat(ys);
  };
};

$.compose = function (f) {
  return function (g) {
    return function (x) {
      return f(g(x));
    };
  };
};



// fold - Array::reduce with array curried
$.fold = function (fn, initial) {
  return function (xs) {
    return xs.reduce(fn, initial);
  };
};

// binary operators that will be folded over - not exported
var add = function (x, y) {
  return x + y;
};

var multiply = function (x, y) {
  return x * y;
};

var concat = function (xs, ys) {
  return xs.concat(ys);
};

var both = function (x, y) {
  return x && y;
};

var either = function (x, y) {
  return x || y;
};


// using fold with binary operators to give lifted functions
// any of these (i.e. they act on a list) can be remembered by "take the " fnName
// wheras the variadic counterpart has the name of the associative operator
$.sum = $.fold(add, 0);
$.product = $.fold(multiply, 1);
$.concatenation = $.fold(concat, []);
$.and = $.fold(both, true);
$.or = $.fold(either, false);

// lifts and unlifts:
// because some functions are already variadic

// lift a multi param function f into a single array fn, inverse of unlift
$.lift = function (fn, context) {
  return function (xs) {
    return fn.apply(context, xs);
  };
};

// examples
// follows the "take the" fnName of list semantic
// max/min already have unlifted variadic counterparts so they can simply be lifted
var maximum = $.maximum = $.lift(Math.max, Math);
var minimum = $.minimum = $.lift(Math.min, Math);


// (new ClassInst) can't be lifted - has to be one manually
// maybe not want to put this in here, after all Object.create exists
// and classes are a different thing for people to disagree over
$.construct = function (Ctor, args) {
  var F = function () {
    Ctor.apply(this, args);
  };
  F.prototype = Ctor.prototype;
  return new F();
};

// take a function operating on an array and turn it into a multi-parameter function, inverse of lift
// because argument based functions are semantic tand is most sensible with zipWith
$.unlift = function (fn, context) {
  return function () {
    var args = slice.call(arguments, 0);
    return fn.apply(context, [args]);
  };
};

// variadic version of lift functions
// named after the operation, i.e. "we " fnName (together) "arg1, arg2, ..."
// variadic => can be used with zipWith for any number of lists
$.add = $.unlift($.sum);
$.multiply = $.unlift($.product);
$.concat = $.unlift($.concatenation);
$.all = $.unlift($.and);
$.any = $.unlift($.or);
$.compose = $.unlift($.composition);

// don't want to fold binary compositions as it's inefficient, so instead:
$.compose = function (/*fns...*/) {
  var fns = arguments;
  return function () {
    var args = arguments;
    for (var i = fns.length - 1; i >= 0; i--) {
      args = [fns[i].apply(this, args)];
    }
    return args[0];
  };
};

// sequence(f1, f2, f3..., fn)(args...) == fn(...(f3(f2(f1(args...)))))
// same as compose, but applies functions in arguments list order
// $.sequence($.plus(2), $.plus(3), $.times(2))(2) -> 14
$.sequence = function (/*fns...*/) {
  var fns = arguments
    , numFns = fns.length;
  return function () {
    var args = arguments;
    for (var i = 0; i < numFns; i++) {
      args = [fns[i].apply(this, args)];
    }
    return args[0];
  };
};

// and their list equivalents:
$.composition = $.lift($.compose);
$.pipeline = $.lift($.sequence);


// scan
// like fold, but keeps intermediary steps
// scan(fn, z)([x1, x2, ...]) == [z, f(z, x1), f(f(z, x1), x2), ...]
$.scan = function (fn, initial) {
  return function (xs) {
    var result = [initial];
    for (var i = 0; i < xs.length; i += 1) {
      result.push(fn(result[i], xs[i]));
    };
    return result;
  };
};

// a few number helpers
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
  return (!a || !b) ? 0 : Math.abs((Math.floor(a / $.gcd(a, b)) * b));
};

// getters/setters

// simple proprety accessor
// can also be used for array number accessor
// get :: Int/String -> Property
$.get = function (prop) {
  return function (el) {
    return el[prop];
  };
};

// property get map -- equivalent to _.pluck or map(get('prop'))
// works with both ary curried or included
// $.collect('length', [ [1,3,2],  [2], [1,2] ]) -> [3,1,2]
$.collect = function (propName, ary) {
  var fn = function (xs) {
    var result = [];
    for (var i = 0; i < xs.length; i += 1) {
      result[i] = xs[i][propName];
    }
    return result;
  };
  return (ary == null) ? fn : fn(ary);
};

$.set = function (propName) {
  return function (el, value) {
    el[propName] = value;
    return el;
  };
};

// modify a list of objects by setting propName on all objects to valFn(currObj)
// property set map -- equivalent to map(set('prop'))
var mmap = $.mmap = function (propName, valFn) {
  return function (xs) {
    for (var i = 0; i < xs.length; i += 1) {
      xs[i][propName] = valFn(xs[i]);
    }
    return xs;
  };
};

// can use mmap('prop1', constant(5))([{}, {a:2}]) -> [{prop1:5}, {a:2, prop1: 5}]|



// general map/zip helpers

// equivalent to _.range
// make it inclusive?..
$.range = function (start, stop, step) {
  if (arguments.length <= 1) {
    stop = start || 0;
    start = 0;
  }
  step = arguments[2] || 1;

  var len = Math.max(Math.ceil((stop - start) / step), 0)
    , idx = 0
    , range = new Array(len);

  while (idx < len) {
    range[idx++] = start;
    start += step;
  }

  return range;
};

$.iterate = function (times, fn) {
  return function (x) {
    var result = [x];
    for (var i = 1; i < times; i += 1) {
      result.push(fn(result[i - 1]));
    }
    return result;
  };
};

//TODO: throttle, memoize, debounce, once
//TODO: clone, extend

// Memoize an expensive function by storing its results in a proper hash.
$.memoize = function (fn, hasher) {
  var memo = Object.create(null);
  hasher || (hasher = $.id);
  return function () {
    var key = hasher.apply(this, arguments);
    memo[key] || (memo[key] = fn.apply(this.arguments));
    return memo[key];
  };
};


// can act as zipWith, zipWith3, zipWith4...
// zipper function must have the same number of arguments as there are lists
// but beyond that, it's very dynamic
// zipWith(function(x,y,z){return x+y+z;}, [1,3,2], [21,1], [2,3]) -> [24,7]
$.zipWith = function () {
  var fn = arguments[0]
    , args = slice.call(arguments, 1)
    , numLists = args.length
    , results = []
    , len = minimum($.collect('length', args));

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
// inlining faster: http://jsperf.com/inlinezip3
$.zip = function () {
  var args = slice.call(arguments, 0)
    , numLists = args.length
    , results = []
    , len = minimum($.collect('length', args));

  for (var i = 0; i < len; i += 1) {
    var els = [];
    for (var j = 0; j < numLists; j += 1) {
      els.push(args[j][i]);
    }
    results.push(els);
  }
  return results;
};


// comparison

// sort helper
// put in property names (in order), you want to order by
// then pass the resulting function to ary.sort()
$.comparing = function () {
  var pargs = slice.call(arguments, 0);
  return function (x, y) {
    for (var i = 0; i < pargs.length; i += 1) {
      if (x[pargs[i]] !== y[pargs[i]]) {
        return x[pargs[i]] - y[pargs[i]];
      }
      return 0;
    }
  };
};


// functional comparison helpers curried to one level
$.gt = function (a) {
  return function (b) {
    return b > a;
  };
};

$.lt = function (a) {
  return function (b) {
    return b < a;
  };
};

$.eq = function (a) {
  return function (b) {
    return b === a;
  };
};

// weak eq
$.weq = function (a) {
  return function (b) {
    return b == a;
  };
};

$.gte = function (a) {
  return function (b) {
    return b >= a;
  };
};

$.lte = function (a) {
  return function (b) {
    return b >= a;
  };
};

// can do stuff like
// [1,4,2,5,2,3].filter(gt(3)); -> [4,5]

$.elem = function (ary) {
  return function (x) {
    return ary.indexOf(x) >= 0;
  };
};

$.notElem = function (ary) {
  return function (x) {
    return ary.indexOf(x) < 0;
  };
};

// allows stuff like
// [[1,3,5], [2,3,1]].filter(any(gte(5))) -> [ [ 1, 3, 5 ] ]
// [1,2,3,4,3].filter(elem([1,3]))  -> [1,3,3]
// [1,2,3,4,3].filter(notElem[1,3]) -> [2,4]

// intersect, intersectBy?

// nub, build up a list of unique (w.r.t. equality)
// elements by checking if current is not 'equal' to anything in the buildup
// nubBy curried with function (x, y) { return x == y; } as the equality function is
// equivalent to nub
$.nub = function (ary) {
  var result = [];
  for (var i = 0; i < ary.length; i += 1) {
    if (result.indexOf(ary[i]) < 0) {
      result.push(ary[i]);
    }
  }
  return result;
};

// nubBy builds up a list of unique (w.r.t. provided equality function) similarly to nub
$.nubBy = function (fn, ary) {
  var result = []
    , resLen = 0
    , len = ary.length;

  for (var i = 0; i < len; i += 1) {
    var keep = true;

    for (var j = 0; j < resLen; j += 1) {
      if (fn(ary[j], ary[i])) {
        var keep = false;
        break;
      }
    }

    if (keep) {
      result.push(ary[i]);
      resLen += 1;
    }
  }
  return result;
};


$.curry = function (fn) {
  var curried = slice.call(arguments, 1);
  return function () {
    var args = curried.concat(slice.call(arguments, 0));
    return fn.apply(this, args);
  };
};

// like curry, but curries the last arguments, and creates a function expecting the first
$.rcurry = function (fn) {
  var curried = slice.call(arguments, 1);
  return function () {
    var args = slice.call(arguments, 0).concat(curried);
    return fn.apply(this, args);
  };
};


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
    return (result === null) ? errorFn() : result;
  };
};

// var errorMsg;
// var cpuSafeFibonacci = $.either(guardedFibonacci, $.constant(errorMsg));
// or
// var cpuSafeFibonaci = $.either(guardedFibonacci, $.curry(console.log, errorMsg))

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


// debug function, wrap it in a function reporting its scope and arguments
// particularly useful when combined with $.iterate
$.trace = function (fn, fnName) {
  var log = (console) ? console.log : noop
    , global = (function () { return this; }())
    , name = fn.name || fnName || "fn";

  return function () {
    var result = fn.apply(this, arguments);
    var scope = (this === global) ? "global" : this;
    log('[', name + '.apply(', scope, ',', slice.call(arguments, 0), ') -> ', result, ']');
    return result;
  };
};

module.exports = $;
