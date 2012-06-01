var slice = Array.prototype.slice;
var f = {};

// common
var id = f.id = function (x) {
  return x;
};

var noop = f.noop = function () {
};

var constant = f.constant = function (val) {
  return function () {
    return val;
  };
};

// curried helper functions for common operations
f.plus = function (x) {
  return function (y) {
    return y + x;
  };
};

f.times = function (x) {
  return function (y) {
    return y * x;
  };
};

f.append = function (xs) {
  return function (ys) {
    return ys.concat(xs);
  };
};

f.compose = function (f) {
  return function (g) {
    return function (x) {
      return f(g(x));
    };
  };
};



// fold - Array::reduce with array curried
var fold = f.fold = function (f, initial) {
  return function (xs) {
    return xs.reduce(f, initial);
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

var chain = function (f, g) {
  return function (x) {
    return f(g(x));
  };
};


// using fold with binary operators to give lifted functions
// any of these (i.e. they act on a list) can be remembered by "take the " fnName
// wheras the variadic counterpart has the name of the associative operator
f.sum = fold(add, 0);
f.product = fold(multiply, 1);
f.flat = fold(concat, []);
f.composition = fold(chain, id);

// we could export these
//f.and = fold(both, true);
//f.or = fold(either, false);

// but prefer faster ES5 methods
// best semantically; "we take the logical" and/or of list
f.and = function (f) {
  return function (xs) {
    return xs.every(f);
  };
};

f.or = function (f) {
  return function (xs) {
    return xs.some(f);
  };
};

// lifts and unlifts:
// because some functions are already variadic

// lift a multi param function f into a single array fn, inverse of unlift
var lift = f.lift = function (f, context) {
  return function (xs) {
    return f.apply(context, xs);
  };
};

// examples
// follows the "take the" fnName of list semantic
// max/min already have unlifted variadic counterparts so they can simply be lifted
var maximum = f.maximum = lift(Math.max, Math);
var minimum = f.maximum = lift(Math.min, Math);


// (new ClassInst) can't be lifted - has to be one manually
// maybe not want to put this in here, after all Object.create exists
// and classes are a different thing for people to disagree over
f.construct = function (Ctor, args) {
  var F = function () {
    Ctor.apply(this, args);
  };
  F.prototype = Ctor.prototype;
  return new F();
};


// take a function operating on an array and turn it into a multi-parameter function, inverse of lift
// because argument based functions are semantic tand is most sensible with zipWith
var unlift = f.unlift = function (f, context) {
  return function () {
    var args = slice.call(arguments, 0);
    return f.apply(context, [args]);
  };
};

// variadic version of lift functions
// named after the operation, i.e. "we " fnName (together) "arg1, arg2, ..."
f.add = unlift(f.sum);
f.multiply = unlift(f.product);
f.concat = unlift(f.flatten);
f.and = unlift(f.all);
f.or = unlift(f.any);
f.compose = unlift(f.composition);


// getters/setters

// simple proprety accessor
// can also be used for array number accessor
// get :: Int/String -> Property
f.get = function (prop) {
  return function (el) {
    return el[prop];
  };
};

// property get map -- equivalent to _.pluck or map(get('prop'))
// zip(pmap('length'), [[1,3,2],[2,1]], [[1],[2]], [[2,3],[2,1]]) -> [[3,1,2], [2,1,2]]
// pmap :: String -> [a] -> [b] -- both curried and as a two param fn
var pmap = f.pmap = function (propName, ary) {
  var fn = function (xs) {
    var result = [];
    for (var i = 0; i < xs.length; i += 1) {
      result[i] = xs[i][propName];
    }
    return result;
  };
  return (ary == null) ? fn : fn(ary);
};

f.set = function (propName) {
  return function (el, value) {
    el[propName] = value;
    return el;
  };
};

// modify a list of objects by setting propName on all objects to valFn(currObj)
// property set map -- equivalent to map(set('prop'))
var mmap = f.mmap = function (propName, valFn) {
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
f.range = function (start, stop, step) {
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

f.iterate = function (f, times) {
  return function (x) {
    var result = [x];
    for (var i = 1; i < times; i += 1) {
      result.push(f(result[i - 1]));
    }
    return result;
  };
};


//TODO: throttle, memoize, debounce, once
//TODO: clone, extend

// can act as zipWith, zipWith3, zipWith4...
// zipper function must have the same number of arguments as there are lists
// but beyond that, it's very dynamic
// zipWith(function(x,y,z){return x+y+z;}, [1,3,2], [21,1], [2,3]) -> [24,7]
f.zipWith = function () {
  var fn = arguments[0]
    , args = slice.call(arguments, 1)
    , numLists = args.length
    , results = []
    , len = minimum(pmap('length', args));

  for (var i = 0; i < len; i += 1) {
    var els = [];
    for (var j = 0; j < numLists; j += 1) {
      els.push(args[j][i]);
    }
    results.push((fn == null) ? els : fn.apply(null, els));
  }
  return results;
};

// zip, zip3, zip4.. all in one!
f.zip = function () {
  return f.zipWith.apply(null, [null].concat(slice.call(arguments, 0)));
};


// comparison

// sort helper
// put in property names (in order), you want to order by
// then pass the resulting function to ary.sort()
f.comparing = function () {
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


// functional comparison helpers
f.gt = function (a) {
  return function (b) {
    return b > a;
  };
};

f.lt = function (a) {
  return function (b) {
    return b < a;
  };
};

f.eq = function (a) {
  return function (b) {
    return b === a;
  };
};

// weak eq
f.weq = function (a) {
  return function (b) {
    return b == a;
  };
};

f.gte = function (a) {
  return function (b) {
    return b >= a;
  };
};

f.lte = function (a) {
  return function (b) {
    return b >= a;
  };
};

// can do stuff like
// [1,4,2,5,2,3].filter(gt(3)); -> [4,5]

f.elem = function (ary) {
  return function (x) {
    return ary.indexOf(x) >= 0;
  };
};

f.notElem = function (ary) {
  return function (x) {
    return ary.indexOf(x) < 0;
  };
};

// allows stuff like
// [[1,3,5], [2,3,1]].filter(any(gte(5))) -> [ [ 1, 3, 5 ] ]
// [1,2,3,4,3].filter(elem([1,3]))  -> [1,3,3]
// [1,2,3,4,3].filter(notElem[1,3]) -> [2,4]

// nub, nubBy, intersect, intersectBy?
f.nub = function (ary) {
  var result = [];
  for (var i = 0; i < ary.length; i += 1) {
    if (ary.indexOf(ary[i], i+1) < 0) {
      result.push(ary[i]);
    }
  }
  return result;
};


f.curry = function (fn) {
  var curried = slice.call(arguments, 1);
  return function () {
    var args = curried.concat(slice.call(arguments, 0));
    return fn.apply(this, args);
  };
};

// like curry, but curries the last arguments, and creates a function expecting the first
f.rcurry = function (fn) {
  var curried = slice.call(arguments, 1);
  return function () {
    var args = slice.call(arguments, 0).concat(curried);
    return fn.apply(this, args);
  };
};

// sequence(f1, f2, f3..., fn)(args...) == fn(...(f3(f2(f1(args...)))))
// f.sequence(f.plus(2), f.plus(3), f.times(2))(2) -> 14
f.sequence = function () {
  var fns = slice.call(arguments, 0)
    , argLen = fns.length;
  return function () {
    var result = slice.call(arguments, 0);
    for (var i = 0; i < argLen; i += 1) {
      result = [fns[i].apply(this, result)];
    }
    return result[0];
  };
};


// guard a function by a condition function
// returns a function that will only apply f(x) if cond(x) is true
f.guard = function (fn, cond) {
  return function (x) {
    return (cond(x)) ? fn(x) : null;
  };
};

// var guardedFibonacci = f.guard(fibonacci, lt(100));

// f.either null guard a function, else return errorFn result
// if errorFn is a logger, then curry it with the required message
f.either = function (guardedFn, errorFn) {
  return function (x) {
    var result = guardedFn(x);
    return (result === null) ? errorFn() : result;
  };
};

// var errorMsg;
// var cpuSafeFibonacci = f.either(guardedFibonacci, f.constant(errorMsg));
// or
// var cpuSafeFibonaci = f.either(guardedFibonacci, f.curry(console.log, errorMsg))



f.pow = function (exponent) {
  return function (x) {
    return Math.pow(x, exponent);
  };
};

f.logBase = function (base) {
  return function (x) {
    return Math.log(x) / Math.log(base);
  };
};


// debug function, wrap it in a function reporting its scope and arguments
// particularly useful when combined with f.iterate
f.trace = function (fn, fnName) {
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

module.exports = f;
