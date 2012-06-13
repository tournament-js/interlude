var a = require('assert')
  , $ = require('../');

exports['test#common'] = function () {
  a.equal($.id(10, 12), 10, "1-dim identity");
  a.isUndefined($.noop(10), "noop");
  a.equal($.constant(5)(10), 5, "constant");
  a.ok(!$.has({}, 'toString'), "{} $.has no (own) toString key");
  a.ok($.has({wee:2}, 'wee'), "obj $.has its own fresh key");
  a.ok($.not(false), "!false");
  a.eql($.range(5).filter($.elem($.range(4))), $.range(4), "range/elem filter");
  a.eql($.range(5).filter($.notElem($.range(4))), [5], "range/elem filter");

  //var res = $.partition($.equality(0)([2]), [[1], [2], [3], [2]]);
  //a.eql(res, [ [[2],[2]] , [[1],[3]] ], "partition using $.equality");
  a.eql($.partition([1,3,2,1,2], $.eq(2)), [[2,2], [1,3,1]], "partition basic");
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

exports["test#higher order looping"] = function () {
  a.equal($.reduce($.plus2, 5)([1,1,1]), 8, "reduce add 5 + 1+1+1 === 8");
  a.eql($.scan([1,1,1], $.plus2, 5), [5,6,7,8],"scan add 5 [1,1,1] === [5,6,7,8]");
  a.eql($.iterate(5, 2, $.times(2)), [2,4,8,16,32], "iterate (*2)");
  a.eql($.range(1,5), $.range(5), "range 1 indexed");
  a.eql($.range(5), [1,2,3,4,5], "range inclusive");
  a.eql($.range(1,5,2), [1,3,5], "range step inclusive");

  a.eql([[1,3,5],[2,3,1]].filter($.any($.gte(5))), [[1,3,5]], "filter any gte");
  a.eql([[1,3,5],[2,2,2]].filter($.all($.eq(2))), [[2,2,2]], "filter all eq");
  a.eql([[1,3,5],[2,2,2]].filter($.none($.eq(2))), [[1,3,5]], "filter none eq");
};

exports["test#lifted functions"] = function () {
  a.equal($.maximum([1,3,2,5,2]), 5, "max [1,3,2,5,2] === 5");
  a.equal($.minimum([1,3,2,5,2]), 1, "min [1,3,2,5,2] === 1");

  var mbRes = $.maximumBy($.comparing('length'), [ [1,3,2], [2], [2,3] ]);
  a.eql(mbRes, [1,3,2], 'maxBy returns the element for which length is maximal');
  var collectRes = $.maximum($.pluck('length', [ [1,3,2], [2], [2,3] ]));
  a.equal(collectRes, 3, "maximum of collects simply returns the value");

  var mbRes = $.minimumBy($.comparing('length'), [ [1,3,2], [2], [2,3] ]);
  a.eql(mbRes, [2], 'minBy returns the element for which length is maximal');
  var collectRes = $.minimum($.pluck('length', [ [1,3,2], [2], [2,3] ]));
  a.equal(collectRes, 1, "minymum of collects simply returns the value");
};


exports["test#composition"] = function () {
  a.equal($.seq3($.plus2, $.plus(5), $.times(2))(3,4), 24, "seq3 fns");
  a.equal($.seq($.plus2, $.plus(5), $.times(2))(3,4), 24, "seq fns");

  var res = $.seq($.plus4, $.plus(1), $.plus(1), $.plus(1))(1,1,1,1);
  a.equal(res, 7, "(1+1+1+1) +1 +1 +1");

  var res = $.seq4($.plus4, $.plus(1), $.plus(1), $.plus(1))(1,1,1,1);
  a.equal(res, 7, "(1+1+1+1) +1 +1 +1 (but seq4)");
};

exports["test#get/set"] = function () {
  // get
  a.equal($.get('length')([1,2,3]), 3, "$.get('length')");
  a.equal($.get('a')({a:2}), 2, "$.get('a')");
  a.equal($.get(1)([5,7]), 7, "$.get(1)");

  // examples of get
  var objs = [{id: 1, s: "h"}, {id: 2, s: "e"}, {id: 3, s: "y"}];
  a.eql(objs.map($.get('id')), [ 1, 2, 3 ], "map get id === 1, 2, 3");
  a.equal(objs.map($.get('s')).join(''), "hey", "map get s join === hey");

  // deep get
  var objs = [
    {id: 1, s: "h", obj: {ary: [1,2]} }
  , {id: 2, s: "e", obj: {ary: [3,4]} }
  , {id: 3, s: "y", obj: {ary: [5,6]} }
  ];
  a.eql(objs.map($.getDeep('obj.ary.1')), [ 2, 4, 6 ], "deep get on objs.obj.ary.1");

  a.eql([[1],[2],[3]].map($.get(0)), [1,2,3], "ary.map($.get(0))");
  a.eql($.pluck(0, [[1],[2],[3]]), [1,2,3], "$.pluck(0, ary))");

};

exports["test#zipWith/zip"] = function () {
  a.eql($.zipWith($.plus2, [1,3,5], [2,4]), [3, 7], "zipWith plus2");
  a.eql($.zipWith($.add, [1,3,5], [0,0,0], [2,4]), [3, 7], "zipWith add");
  a.eql($.zip([1,3,5], [2,4]), [[1,2], [3,4]], "zip 2 lists");
  a.eql($.zip([1,3,5], [0,0,0], [2,4]), [[1,0,2], [3,0,4]], "zip 3 lists");
};

exports["test#ordering"] = function () {
  // compare
  a.eql([[1,3],[1,2],[1,5]].sort($.comparing(1)), [[1,2],[1,3],[1,5]], "comparing");
  a.eql([{a:2},{a:1}].sort($.comparing('a')), [{a:1}, {a:2}], "comparing objs");

  var money = [{id: 1, money: 3}, {id: 2, money: 0}, {id: 3, money: 3}];
  var res = money.sort($.comparing('money', '-', 'id', '-'));
  var resExp = [ { id: 3, money: 3 }, { id: 1, money: 3 }, { id: 2, money: 0 } ];
  a.eql(res, resExp, "money max first, then id max first");

  var res = money.sort($.comparing('money', '-', 'id', '+'));
  var resExp = [ { id: 1, money: 3 }, { id: 3, money: 3 }, { id: 2, money: 0 } ];
  a.eql(res, resExp, "money max first, then id min first");

  var res = money.sort($.comparing('money', '-', 'id'));
  var resExp = [ { id: 1, money: 3 }, { id: 3, money: 3 }, { id: 2, money: 0 } ];
  a.eql(res, resExp, "money max first, then id min (default ('+'))");

};

exports["test#list operations"] = function () {
  var eq = $.equality('length');

  a.eql($.intersect([1,2,3,4], [2,4,6,8]), [2,4], "intersect basic");
  a.eql($.intersect([1,2,2,3,4], [6,4,4,2]), [2,2,4], "intersect duplicates");

  var res = $.intersectBy($.equality(1), [[1,3],[2,1],[1,4]], [[1,2], [2,4]]);
  a.eql(res, [[1,4]], "intersectBy crazy, result is in first list");

  // insert
  a.eql($.insert([1,2,3,4],2), [1,2,2,3,4], "insert in middle");
  a.eql($.insert([1,2,3,4],5), [1,2,3,4,5], "insert at end");
  a.eql($.insert([1,2,3,4],0), [0,1,2,3,4], "insert at beginning");

  var xs = $.range(10);
  $.insert(xs, 5);
  a.equal(xs.length, 10+1, "insert modifies");

  a.eql($.insertBy($.compare('-'), [4,3,2,1], 2), [4,3,2,2,1], "insert desc mid");
  a.eql($.insertBy($.compare('-'), [4,3,2,1], 0), [4,3,2,1,0], "insert desc end");
  a.eql($.insertBy($.compare('-'), [4,3,2,1], 5), [5,4,3,2,1], "insert desc end");

  var xs = [ [5,1], [4,2], [3,3] ];
  var res = $.insertBy($.comparing(1), xs.slice(), [8,2]);
  a.eql(res, [ [5,1], [8,2], [4,2], [3,3] ], "insertBy comparing (1) mid");
  var res = $.insertBy($.comparing(1), xs.slice(), [8,0]);
  a.eql(res, [ [8,0], [5,1], [4,2], [3,3] ], "insertBy comparing (1) beg");
  var res = $.insertBy($.comparing(1), xs.slice(), [8,4]);
  a.eql(res, [ [5,1], [4,2], [3,3], [8,4] ], "insertBy comparing (1) end");

  // delete
  var res = $.deleteBy($.equality(1), [[1,3],[2,1],[1,4]], [5,1]);
  a.eql(res, [[1,3], [1,4]], "delete by equality(1)");

  var res = $.deleteBy($.equality(0), [[1,3],[2,1],[1,4]], [1,999]);
  a.eql(res, [[2,1], [1,4]], "delete by equality(0) removes only first");

  a.eql($.delete($.range(5), 5), $.range(4), "delete from range");
  a.eql($.delete($.range(3), 2), [1,3], "delete from small range");
  a.eql($.delete([1,1,2,2], 2), [1,1,2], "delete from duplicate list");
  a.eql($.delete([1,1,2,2], 1), [1,2,2], "delete from duplicate list");

  a.eql($.nub([2,3,7,5]), [2,3,7,5], "nub on unique");
  a.eql($.nubBy($.eq2, [2,3,7,5]), [2,3,7,5], "nub on unique");
  a.eql($.nub([1,3,2,4,1,2]), [1,3,2,4], "nub basic");
  a.eql($.nubBy($.eq2, [1,3,2,4,1,2]), [1,3,2,4], "nubBy basic");

  a.eql($.nub([1,1,1,1]), [1], "nub ones basic");
  a.eql($.nubBy($.eq2, [1,1,1,1]), [1], "nubBy ones basic");

  var res = $.nubBy($.equality(1), [[1,3],[5,2],[2,3],[2,2]]);
  a.eql(res, [[1,3],[5,2]], "nubBy equality on 1");

  var notCoprime = $.seq2($.gcd, $.gt(1));
  a.eql($.nubBy(notCoprime, $.range(2, 11)), [2,3,5,7,11], "primes nubBy");

  a.eql($.union([1,3,2,4], [2,3,7,5]), [1,3,2,4,7,5], "union");
  var res = $.pluck(1, $.unionBy($.equality(1)
    , [[0,1],[0,3],[0,2],[0,4]]
    , [[0,2],[0,3],[0,7],[0,5]]
  ));
  a.eql(res, [1,3,2,4,7,5], "unionBy eq(1) works equally well");

  a.eql($.difference([1,2,2,3,4], [1,2,3]), [2,4], "difference simple");
  var xs = $.range(5);
  var ys = $.range(3)
  a.eql($.difference(ys.concat(xs), ys), xs, "difference prop");

  var res = $.differenceBy($.equality('a')
    , [{a:1}, {a:2}, {a:3}]
    , [{a:2, b:1}, {a:4, b:2}]
  );
  a.eql(res, [{a:1}, {a:3}], "differenceBy");

  a.eql($.group([1,3,3,2,4,4]), [[1],[3,3],[2],[4,4]], "basic group");
  a.eql($.group([1,1,1,1]), [[1,1,1,1]], "basic group ones");

  var res = $.groupBy($.equality(1), [[1,3],[2,1],[4,1],[2,3]]);
  a.eql(res, [ [[1,3]], [[2,1],[4,1]], [[2,3]] ], "groupBy equality on 1");
};

