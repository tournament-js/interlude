var slice = Array.prototype.slice;

// curried helper functions for common operations
exports.plus = function (x) {
  return function (y) {
    return y + x;
  };
};

exports.times = function (x) {
  return function (y) {
    return y * x;
  };
};

exports.append = function (xs) {
  return function (ys) {
    return ys.concat(xs);
  };
};



// fold - Array::reduce with array curried
var fold = exports.fold = function (f, initial) {
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
exports.sum = fold(add, 0);
exports.product = fold(multiply, 1);
exports.flatten = fold(concat, []);
exports.and = fold(both, true);
exports.or = fold(either, false);



// lifts and unlifts:


// take a function operating on an array and turn it into a multi-parameter function, inverse of lift
var unlift = exports.unlift = function (f, context) {
  return function () {
    var args = slice.call(arguments, 0);
    return f.apply(context, [args]);
  };
};

// lift a multi param function f into a single array fn, inverse of unlift
var lift = exports.lift = function (f, context) {
  return function (xs) {
    return f.apply(context, xs);
  };
};

// examples
// max/min already have unlifted variadic counterparts so they can simply be lifted
var maximum = lift(Math.max, Math);
var minimum = lift(Math.min, Math);


// (new ClassInst) can't be lifted - has to be one manually
// maybe not want to put this in here, after all Object.create exists
// and classes are a different thing for people to disagree over
exports.construct = function (Ctor, args) {
  var F = function () {
    Ctor.apply(this, args);
  };
  F.prototype = Ctor.prototype;
  return new F();
};

exports.addN = unlift(exports.sum);
exports.multiplyN = unlift(exports.product);
exports.concatN = unlift(exports.flatten);
exports.andN = unlift(exports.and);
exports.orN = unlift(exports.or);


// getters/setters

// simple proprety accessor
// can also be used for array number accessor
// get :: Int/String -> Property
exports.get = function (prop) {
  return function (el) {
    return el[prop];
  };
};

// property get map -- equivalent to _.pluck or map(get('prop'))
// zip(pmap('length'), [[1,3,2],[2,1]], [[1],[2]], [[2,3],[2,1]]) -> [[3,1,2], [2,1,2]]
// pmap :: String -> [a] -> [b] -- both curried and as a two param fn
var pmap = exports.pmap = function (propName, ary) {
  var fn = function (xs) {
    var result = [];
    for (var i = 0; i < xs.length; i += 1) {
      result[i] = xs[i][propName];
    }
    return result;
  };
  return (ary == null) ? fn : fn(ary);
};

exports.set = function (propName) {
  return function (el, value) {
    el[propName] = value;
    return el;
  };
};

// modify a list of objects by setting propName on all objects to valFn(currObj)
// property set map -- equivalent to map(set('prop'))
var mmap = exports.mmap = function (propName, valFn) {
  return function (xs) {
    for (var i = 0; i < xs.length; i += 1) {
      xs[i][propName] = valFn(xs[i]);
    }
    return xs;
  };
};

// can use mmap('prop1', constant(5))([{}, {a:2}]) -> [{prop1:5}, {a:2, prop1: 5}]|



// general map/zip helpers

var constant = exports.constant = function (val) {
  return function () {
    return val;
  };
};

// equivalent to _.range
exports.range = function (start, stop, step) {
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

exports.iterate = function (f, times) {
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
var zipWith = function () {
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
var zip = function () {
  return zipWith.apply(null, [null].concat(slice.call(arguments,0)));
};


// comparison

// sort helper
// put in property names (in order), you want to order by
// then pass the resulting function to ary.sort()
var comparing = function () {
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
exports.gt = function (a) {
  return function (b) {
    return b > a;
  };
};

exports.lt = function (a) {
  return function (b) {
    return b < a;
  };
};

exports.eq = function (a) {
  return function (b) {
    return b === a;
  };
};

// weak eq
exports.weq = function (a) {
  return function (b) {
    return b == a;
  };
};

exports.gte = function (a) {
  return function (b) {
    return b >= a;
  };
};

exports.lte = function (a) {
  return function (b) {
    return b >= a;
  };
};
// can do stuff like
// [1,4,2,5,2,3].filter(gt(3)); -> [4,5]

// any / all helpers
// if uncurried use preferred, use ES5 methods: Array::some, Array::every
exports.any = function (f) {
  return function (xs) {
    return xs.some(f);
  };
};

exports.all = function (f) {
  return function (xs) {
    return xs.every(f);
  };
};

exports.elem = function (ary) {
  return function (x) {
    return ary.indexOf(x) >= 0;
  };
};

exports.notElem = function (ary) {
  return function (x) {
    return ary.indexOf(x) < 0;
  };
};

// allows stuff like
// [[1,3,5], [2,3,1]].filter(any(gte(5))) -> [ [ 1, 3, 5 ] ]
// [1,2,3,4,3].filter(elem([1,3]))  -> [1,3,3]
// [1,2,3,4,3].filter(notElem[1,3]) -> [2,4]

// nub, nubBy, intersect, intersectBy?


//exports.either null guard a function, else produce a warning?


var curry = function (fn) {
  var curried = slice.call(arguments, 1);
  return function () {
    var args = curried.concat(slice.call(arguments, 0));
    return fn.apply(this, args);
};


// guard a function by a condition function
// returns a function that will only apply f(x) if cond(x) is true
exports.guard = function (fn, cond) {
  return function (x) {
    return (cond(x)) ? fn(x) : null;
  };
};

// var cpuSafeFibonacci = guard(fibonacci, lt(100));

exports.pow = function (exponent) {
  return function (x) {
    return Math.pow(x, exponent);
  };
};

exports.logBase = function (base) {
  return function (x) {
    return Math.log(x) / Math.log(base);
  };
};
