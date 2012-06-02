var a = require('assert')
  , t = require('typr')
  , $ = require('../');

exports['test#common'] = function () {
  a.equal($.id(10, 12), 10, "1-dim identity");
  a.isUndefined($.noop(10), "noop");
  a.equal($.constant(5)(10), 5, "constant");
  a.ok(!$.has({}, 'toString'), "{} $.has no (own) toString key");
  a.ok($.has({wee:2}, 'wee'), "obj $.has its own fresh key");
};

exports['test#math'] = function () {
  a.equal($.gcd(5, 3), 1, "primes 5,3 are coprime");
  a.equal($.gcd(21, 14), 7, "21 and 14 have 7 as gcd");
  a.equal($.lcm(5, 3), 15, "primes 5 and 3 have lcm as product");
  a.equal($.lcm(21, 14), 42, "21 and 14 have 42 as lcm");
  a.equal($.pow(3)(2), 8, "2^3 === 8");
  a.equal($.pow(0)(3), 1, "3^0 === 1");
  a.equal($.pow(2)(4), 16, "4^2 === 16");
  a.equal($.logBase(2)(16), 4, "4 is log2 of 16");
  a.equal($.logBase(10)(100), 2, "2 is log10 of 1000");
};

exports['test#uncurried binary ops'] = function () {
  a.equal($.add2(3,2), 5, "2+3 === 5");
  a.equal($.multiply2(3,5), 15, "5*3 === 15");
  a.equal($.and2(false, false), false, "false && false === false");
  a.equal($.and2(true, false), false, "true && false === false");
  a.equal($.and2(false, true), false, "false && true === false");
  a.equal($.and2(true, true), true, "true && true === true");
  a.equal($.or2(false, false), false, "false || false === false");
  a.equal($.or2(true, false), true, "true || false === true");
  a.equal($.or2(false, true), true, "false || true === true");
  a.equal($.or2(true, true), true, "true || true === true");
  a.eql($.concat2([1,2], [3]), [1,2,3], "[1, 2].concat([3]) === [1, 2, 3]");
};

exports['test#curried binary ops'] = function () {
  a.equal($.plus(3)(2), 5, "2+3 === 5");
  a.equal($.subtract(3)(5), 2, "5-3 === 2");
  a.equal($.times(2)(3), 6, "2*3 === 6");
  a.equal($.divide(2)(6), 3, "6/2 === 3");
  a.eql($.append([1,2])([3]), [3,1,2], "(++[1, 2]) [3] === [3, 1, 2]");
  a.eql($.prepend([1,2])([3]), [1,2,3], "([1, 2]++) [3] === [1, 2, 3]");
};

exports["test#fold & scan"] = function () {
  a.equal($.fold($.add2, 5)([1,1,1]), 8, "fold add 5 + 1+1+1 === 8");
  a.eql($.scan($.add2, 5)([1,1,1]), [5,6,7,8],"scan add 5 [1,1,1] === [5,6,7,8]");
};

exports["test#folded shortcuts"] = function () {
  a.equal($.sum([1,2,3,4]), 10, "sum [1,2,3,4] === 10");
  a.equal($.product([1,2,3,4]), 24, "product [1,2,3,4] === 24");
  a.equal($.and([true, true, false]), false, "and [true, true, false] === false");
  a.equal($.or([true, false, false]), true, "and [true, false, false] === true");
  a.eql($.concatenation([[1,2,3],[4],[[5]]]), [1,2,3,4,[5]], "$.concatenation");
};

exports["test#lifted functions"] = function () {
  a.equal($.maximum([1,3,2,5,2]), 5, "max [1,3,2,5,2] === 5");
  a.equal($.minimum([1,3,2,5,2]), 1, "min [1,3,2,5,2] === 1");
  a.equal($.add(1,2,3,4), 10, "add(1,2,3,4) === 10");
  a.equal($.multiply(1,2,3,4), 24, "multiply(1,2,3,4) === 24");
  a.eql($.concat([1,2,3], [4], [[5]]), [1,2,3,4,[5]], "$.concat");
  a.equal($.all(true, true, true, true), true, "all(true, true, true)");
  a.equal($.any(false, false, false, false), false, "any(false, false)");
  a.equal($.all(true, true, true, false), false, "all(1,1,1,0)");
  a.equal($.any(false, false, true, false), true, "any(0,0,1,0)");

  // lift unlift inverses
  a.equal($.lift($.add)([1,2,3,4]), 10, "lift add [1,2,3,4] === 10");
  a.equal($.unlift($.lift($.add))(1,2,3,4), 10, "unlift lift add (1,2,3,4)");
  a.equal($.unlift($.sum)(1,2,3,4), 10, "unlift sum (1,2,3,4)");
  a.equal($.lift($.unlift($.sum))([1,2,3,4]), 10, "lift unlift sum [1,2,3,4]");
};


exports["test#composition"] = function () {
  a.equal($.compose($.times(2), $.plus(5), $.add2)(3,4), 24, "compose 3 fns");
  a.equal($.sequence($.add2, $.plus(5), $.times(2))(3,4), 24, "compose 3 fns");
  a.equal($.composition([$.times(2), $.plus(5), $.add2])(3,4), 24, "composition");
  a.equal($.pipeline([$.add2, $.plus(5), $.times(2)])(3,4), 24, "pipeline");
};

exports["test#get/set"] = function () {
  // get
  a.equal($.get('length')([1,2,3]), 3, "$.get('length')");
  a.equal($.get('a')({a:2}), 2, "$.get('a')");
  a.equal($.get(1)([5,7]), 7, "$.get(1)");
  a.eql([[1],[2],[3]].map($.get(0)), [1,2,3], "ary.map($.get(0))");
  a.eql($.collect(0, [[1],[2],[3]]), [1,2,3], "$.collect(0, ary))");
  a.eql($.collect(0) ([[1],[2],[3]]), [1,2,3], "$.collect(0)(ary))");
  // set
  var obj = {};
  $.set('a')(obj, 3);
  a.equal(obj.a, 3, "$.set simple");
  var objs = [{}, {a : 2}];
  $.zipWith($.set('a'), objs, [5,5]);
  a.equal(objs[0].a, 5, "$.set via zipWith");
  a.equal(objs[1].a, 5, "$.set via zipWith");

  $.inject('c', $.constant(3))(objs);
  a.equal(objs[0].c, 3, "$.inject constant 3 on prop 'c'");
  a.equal(objs[1].c, 3, "$.inject constant 3 on prop 'c'");
};






