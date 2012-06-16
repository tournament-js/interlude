var tap = require('tap')
  , test = tap.test
  , $ = require('../');

test('common', function (t) {
  t.equal($.id(10, 12), 10, "1-dim identity");
  t.equal($.noop(10), undefined, "noop");
  t.equal($.constant(5)(10), 5, "constant");
  t.ok(!$.has({}, 'toString'), "{} $.has no (own) toString key");
  t.ok($.has({wee:2}, 'wee'), "obj $.has its own fresh key");
  t.ok($.not(false), "!false");
  t.deepEqual($.range(5).filter($.elem($.range(4))), $.range(4), "range/elem filter");
  t.deepEqual($.range(5).filter($.notElem($.range(4))), [5], "range/elem filter");
  t.end();
});

test('math', function (t) {
  t.equal($.gcd(5, 3), 1, "primes 5,3 are coprime");
  t.equal($.gcd(21, 14), 7, "21 and 14 have 7 as gcd");
  t.equal($.lcm(5, 3), 15, "primes 5 and 3 have lcm as product");
  t.equal($.lcm(21, 14), 42, "21 and 14 have 42 as lcm");
  t.equal($.pow(3)(2), 8, "2^3 === 8");
  t.equal($.pow(0)(3), 1, "3^0 === 1");
  t.equal($.pow(2)(4), 16, "4^2 === 16");
  t.equal($.logBase(2)(16), 4, "4 is log2 of 16");
  t.equal($.logBase(10)(100), 2, "2 is log10 of 1000");
  t.end();
});

test("looping constructs", function (t) {
  t.deepEqual($.range(1,5), $.range(5), "range 1 indexed");
  t.deepEqual($.range(5), [1,2,3,4,5], "range inclusive");
  t.deepEqual($.range(1,5,2), [1,3,5], "range step inclusive");
  t.deepEqual($.range(1,6,2), [1,3,5], "range step inclusive");

  t.deepEqual($.replicate(3, 2), [2,2,2], "replicate 3 2");
  t.deepEqual($.replicate(0, 5), [], "replicate 0 5");
  t.equal($.replicate(100, 5).length, 100, "replicate 100 x has length 100");

  t.deepEqual($.scan([1,1,1], $.plus2, 5), [5,6,7,8],"scan add 5 [1,1,1] === [5,6,7,8]");
  t.deepEqual($.iterate(5, 2, $.times(2)), [2,4,8,16,32], "iterate (*2)");

  t.equal($.reduce($.plus2, 5)([1,1,1]), 8, "reduce add 5 + 1+1+1 === 8");

  t.deepEqual([[1,3,5],[2,3,1]].filter($.any($.gte(5))), [[1,3,5]], "filter any gte");
  t.deepEqual([[1,3,5],[2,2,2]].filter($.all($.eq(2))), [[2,2,2]], "filter all eq");
  t.deepEqual([[1,3,5],[2,2,2]].filter($.none($.eq(2))), [[1,3,5]], "filter none eq");
  t.end();
});

test("composition", function (t) {
  t.equal($.seq3($.plus2, $.plus(5), $.times(2))(3,4), 24, "seq3 fns");
  t.equal($.seq($.plus2, $.plus(5), $.times(2))(3,4), 24, "seq fns");

  var res = $.seq($.plus4, $.plus(1), $.plus(1), $.plus(1))(1,1,1,1);
  t.equal(res, 7, "(1+1+1+1) +1 +1 +1");

  var res = $.seq4($.plus4, $.plus(1), $.plus(1), $.plus(1))(1,1,1,1);
  t.equal(res, 7, "(1+1+1+1) +1 +1 +1 (but seq4)");
  t.end();
});

test("accessors", function (t) {
  // first/last
  var ary = [{a:1}, {a:2}, {a:2, b:1}, {a:3}];
  var aEq2 = $.seq2($.get('a'), $.eq(2));
  t.deepEqual($.first(ary), {a:1}, "first");
  t.deepEqual($.last(ary), {a:3}, "last");
  t.deepEqual($.last([]), undefined, "last of empty");
  t.deepEqual($.first([]), undefined, "first of empty");
  t.deepEqual($.lastBy($.id, []), undefined, "lastBy $.id of empty");
  t.deepEqual($.firstBy($.id, []), undefined, "first $.id of empty");

  t.deepEqual($.firstBy(aEq2, ary), {a:2}, "firstBy aEq2");
  t.deepEqual($.lastBy(aEq2, ary), {a:2, b:1}, "lastBy aEq2");

  // get
  t.equal($.get('length')([1,2,3]), 3, "$.get('length')");
  t.equal($.get('a')({a:2}), 2, "$.get('a')");
  t.equal($.get(1)([5,7]), 7, "$.get(1)");

  // examples of get
  var objs = [{id: 1, s: "h"}, {id: 2, s: "e"}, {id: 3, s: "y"}];
  t.deepEqual(objs.map($.get('id')), [ 1, 2, 3 ], "map get id === 1, 2, 3");
  t.equal(objs.map($.get('s')).join(''), "hey", "map get s join === hey");

  // deep get
  var objs = [
    {id: 1, s: "h", obj: {ary: [1,2]} }
  , {id: 2, s: "e", obj: {ary: [3,4]} }
  , {id: 3, s: "y", obj: {ary: [5,6]} }
  ];
  t.deepEqual(objs.map($.getDeep('obj.ary.1')), [ 2, 4, 6 ], "deep get on objs.obj.ary.1");

  t.deepEqual([[1],[2],[3]].map($.get(0)), [1,2,3], "ary.map($.get(0))");

  // pluck
  t.deepEqual($.pluck(0, [[1],[2],[3]]), [1,2,3], "$.pluck(0, ary)");
  t.deepEqual($.pluck('a', [{a:2}, {a:3}]), [2,3], "$.pluck('a', ary)");
  
  // first/last
  var ary = [{a:1}, {a:2}, {a:2, b:1}, {a:3}];
  var aEq2 = $.seq2($.get('a'), $.eq(2))
  t.deepEqual($.first(ary), {a:1}, "first");
  t.deepEqual($.last(ary), {a:3}, "last");
  t.deepEqual($.last([]), undefined, "last of empty");
  t.deepEqual($.first([]), undefined, "first of empty");
  t.deepEqual($.lastBy($.id, []), undefined, "lastBy $.id of empty");
  t.deepEqual($.firstBy($.id, []), undefined, "first $.id of empty");

  t.deepEqual($.firstBy(aEq2, ary), {a:2}, "firstBy aEq2");
  t.deepEqual($.lastBy(aEq2, ary), {a:2, b:1}, "lastBy aEq2");
  t.end();
});

test("zipWith/zip", function (t) {
  t.deepEqual($.zipWith($.plus2, [1,3,5], [2,4]), [3, 7], "zipWith plus2");
  t.deepEqual($.zipWith($.add, [1,3,5], [0,0,0], [2,4]), [3, 7], "zipWith add");
  t.deepEqual($.zip([1,3,5], [2,4]), [[1,2], [3,4]], "zip 2 lists");
  t.deepEqual($.zip([1,3,5], [0,0,0], [2,4]), [[1,0,2], [3,0,4]], "zip 3 lists");
  t.end();
});

test("misc", function (t) {
  // stuff that relies on many modules for consistency with examples
  var notCoprime = $.seq2($.gcd, $.gt(1));
  t.deepEqual($.nubBy(notCoprime, $.range(2, 11)), [2,3,5,7,11], "primes nubBy");
  t.end();
});

