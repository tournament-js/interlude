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
  t.end();
});

test("comparison and equality", function (t) {
  // compare
  t.deepEqual([2,4,1,3].sort($.compare()), [2,4,1,3].sort(), "$.compare is default behavior");
  t.deepEqual([2,4,1,3].sort($.compare()), [1,2,3,4], "$.compare is default behavior asc");
  t.deepEqual([2,4,1,3].sort($.compare('+')), [1,2,3,4], "$.compare is default behavior (asc specified)");
  t.deepEqual([2,4,1,3].sort($.compare('-')), [4,3,2,1], "$.compare can change direction");

  // comparing
  t.deepEqual([[1,3],[1,2],[1,5]].sort($.comparing(1)), [[1,2],[1,3],[1,5]], "comparing");
  t.deepEqual([{a:2},{a:1}].sort($.comparing('a')), [{a:1}, {a:2}], "comparing objs");

  var money = [{id: 1, money: 3}, {id: 2, money: 0}, {id: 3, money: 3}];
  var res = money.sort($.comparing('money', '-', 'id', '-'));
  var resExp = [ { id: 3, money: 3 }, { id: 1, money: 3 }, { id: 2, money: 0 } ];
  t.deepEqual(res, resExp, "money max first, then id max first");

  var res = money.sort($.comparing('money', '-', 'id', '+'));
  var resExp = [ { id: 1, money: 3 }, { id: 3, money: 3 }, { id: 2, money: 0 } ];
  t.deepEqual(res, resExp, "money max first, then id min first");

  var res = money.sort($.comparing('money', '-', 'id'));
  var resExp = [ { id: 1, money: 3 }, { id: 3, money: 3 }, { id: 2, money: 0 } ];
  t.deepEqual(res, resExp, "money max first, then id min (default ('+'))");

  // equality
  var eq1 = $.equality(1);
  t.equal(eq1([2,1], [5,1]), true, "equality on 1");
  t.equal(eq1([2,1], [2,2]), false, "!equality on 1");

  eq2 = $.equality('a');
  t.equal(eq2({a:5}, {a:3}), false, "!equality on a");
  t.equal(eq2({a:5}, {}), false, "!equality on a (failed to exist)");
  t.equal(eq2({a:5}, {b:2, a:5}), true, "equality on a");

  t.end();
});

test("zipWith/zip", function (t) {
  t.deepEqual($.zipWith($.plus2, [1,3,5], [2,4]), [3, 7], "zipWith plus2");
  t.deepEqual($.zipWith($.add, [1,3,5], [0,0,0], [2,4]), [3, 7], "zipWith add");
  t.deepEqual($.zip([1,3,5], [2,4]), [[1,2], [3,4]], "zip 2 lists");
  t.deepEqual($.zip([1,3,5], [0,0,0], [2,4]), [[1,0,2], [3,0,4]], "zip 3 lists");
  t.end();
});

test("maxBy/minBy", function (t) {
  t.equal($.maximum([1,3,2,5,2]), 5, "max [1,3,2,5,2] === 5");
  t.equal($.minimum([1,3,2,5,2]), 1, "min [1,3,2,5,2] === 1");

  // generalized
  var mbRes = $.maximumBy($.comparing('length'), [ [1,3,2], [2], [2,3] ]);
  t.deepEqual(mbRes, [1,3,2], 'maxBy returns the element for which length is maximal');
  var collectRes = $.maximum($.pluck('length', [ [1,3,2], [2], [2,3] ]));
  t.equal(collectRes, 3, "maximum of collects simply returns the value");

  var mbRes = $.minimumBy($.comparing('length'), [ [1,3,2], [2], [2,3] ]);
  t.deepEqual(mbRes, [2], 'minBy returns the element for which length is maximal');
  var collectRes = $.minimum($.pluck('length', [ [1,3,2], [2], [2,3] ]));
  t.equal(collectRes, 1, "minymum of collects simply returns the value");
  t.end();
});


test("list operations", function (t) {
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

  // insert
  t.deepEqual($.insert([1,2,3,4],2), [1,2,2,3,4], "insert in middle");
  t.deepEqual($.insert([1,2,3,4],5), [1,2,3,4,5], "insert at end");
  t.deepEqual($.insert([1,2,3,4],0), [0,1,2,3,4], "insert at beginning");

  var xs = $.range(10);
  $.insert(xs, 5);
  t.equal(xs.length, 10+1, "insert modifies");

  t.deepEqual($.insertBy($.compare('-'), [4,3,2,1], 2), [4,3,2,2,1], "insert desc mid");
  t.deepEqual($.insertBy($.compare('-'), [4,3,2,1], 0), [4,3,2,1,0], "insert desc end");
  t.deepEqual($.insertBy($.compare('-'), [4,3,2,1], 5), [5,4,3,2,1], "insert desc end");

  var xs = [ [5,1], [4,2], [3,3] ];
  var res = $.insertBy($.comparing(1), xs.slice(), [8,2]);
  t.deepEqual(res, [ [5,1], [8,2], [4,2], [3,3] ], "insertBy comparing (1) mid");
  var res = $.insertBy($.comparing(1), xs.slice(), [8,0]);
  t.deepEqual(res, [ [8,0], [5,1], [4,2], [3,3] ], "insertBy comparing (1) beg");
  var res = $.insertBy($.comparing(1), xs.slice(), [8,4]);
  t.deepEqual(res, [ [5,1], [4,2], [3,3], [8,4] ], "insertBy comparing (1) end");

  // delete
  var res = $.deleteBy($.equality(1), [[1,3],[2,1],[1,4]], [5,1]);
  t.deepEqual(res, [[1,3], [1,4]], "delete by equality(1)");

  var res = $.deleteBy($.equality(0), [[1,3],[2,1],[1,4]], [1,999]);
  t.deepEqual(res, [[2,1], [1,4]], "delete by equality(0) removes only first");

  t.deepEqual($.delete($.range(5), 5), $.range(4), "delete from range");
  t.deepEqual($.delete($.range(3), 2), [1,3], "delete from small range");
  t.deepEqual($.delete([1,1,2,2], 2), [1,1,2], "delete from duplicate list");
  t.deepEqual($.delete([1,1,2,2], 1), [1,2,2], "delete from duplicate list");


  // non-modifying
  // intersect
  var eq = $.equality('length');
  t.deepEqual($.intersect([1,2,3,4], [2,4,6,8]), [2,4], "intersect basic");
  t.deepEqual($.intersect([1,2,2,3,4], [6,4,4,2]), [2,2,4], "intersect duplicates");

  var res = $.intersectBy($.equality(1), [[1,3],[2,1],[1,4]], [[1,2], [2,4]]);
  t.deepEqual(res, [[1,4]], "intersectBy crazy, result is in first list");

  // nub
  t.deepEqual($.nub([2,3,7,5]), [2,3,7,5], "nub on unique");
  t.deepEqual($.nubBy($.eq2, [2,3,7,5]), [2,3,7,5], "nub on unique");
  t.deepEqual($.nub([1,3,2,4,1,2]), [1,3,2,4], "nub basic");
  t.deepEqual($.nubBy($.eq2, [1,3,2,4,1,2]), [1,3,2,4], "nubBy basic");

  t.deepEqual($.nub([1,1,1,1]), [1], "nub ones basic");
  t.deepEqual($.nubBy($.eq2, [1,1,1,1]), [1], "nubBy ones basic");

  var res = $.nubBy($.equality(1), [[1,3],[5,2],[2,3],[2,2]]);
  t.deepEqual(res, [[1,3],[5,2]], "nubBy equality on 1");

  var notCoprime = $.seq2($.gcd, $.gt(1));
  t.deepEqual($.nubBy(notCoprime, $.range(2, 11)), [2,3,5,7,11], "primes nubBy");

  // group
  t.deepEqual($.group([1,3,3,2,3,3]), [[1],[3,3],[2],[3,3]], "basic group");
  t.deepEqual($.group([1,1,1,1]), [[1,1,1,1]], "basic group ones");

  var res = $.groupBy($.equality(1), [[1,3],[2,1],[4,1],[2,3]]);
  t.deepEqual(res, [ [[1,3]], [[2,1],[4,1]], [[2,3]] ], "groupBy equality on 1");


  // union
  t.deepEqual($.union([1,3,2,4], [2,3,7,5]), [1,3,2,4,7,5], "union");
  var res = $.pluck(1, $.unionBy($.equality(1)
    , [[0,1],[0,3],[0,2],[0,4]]
    , [[0,2],[0,3],[0,7],[0,5]]
  ));
  t.deepEqual(res, [1,3,2,4,7,5], "unionBy eq(1) works equally well");

  // difference
  t.deepEqual($.difference([1,2,2,3,4], [1,2,3]), [2,4], "difference simple");
  var xs = $.range(5);
  var ys = $.range(3)
  t.deepEqual($.difference(ys.concat(xs), ys), xs, "difference prop");

  var res = $.differenceBy($.equality('a')
    , [{a:1}, {a:2}, {a:3}]
    , [{a:2, b:1}, {a:4, b:2}]
  );
  t.deepEqual(res, [{a:1}, {a:3}], "differenceBy");
  t.end();
});
