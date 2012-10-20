var tap = require('tap')
  , test = tap.test
  , $ = require('../');

test("readme", function (t) {
  t.deepEqual([1,3,2,6,5,4].filter($.gt(4)), [ 6, 5 ], "filter gt 4");

  t.deepEqual($.range(5).map($.pow(2)), [ 1, 4, 9, 16, 25 ], "[1..5] map pow 2");

  var nested = [ [1,3,2], [2,2], [1,4,2,3] ];
  t.deepEqual(nested.filter($.all($.eq(2))), [ [2, 2] ], "nested filter all eq 2");

  nested.sort($.comparing('length'));
  t.deepEqual(nested, [ [ 2, 2 ], [ 1, 3, 2 ], [ 1, 4, 2, 3 ] ], "nested sort prop");

  nested.map($.invoke('sort', $.compare(-1)));
  t.deepEqual(nested, [ [ 2, 2 ], [ 3, 2, 1 ], [ 4, 3, 2, 1 ] ], "nested sort value");

  var pairs = [['woo', 3], ['wee', 1], ['boo', 2]];
  var pairSort = pairs.sort($.comparing(1)).map($.first);
  t.deepEqual(pairSort, [ 'wee', 'boo', 'woo' ], "pairSort map first");

  var zipP3 = $.zipWith($.plus3, [1,1,1,1,1], $.range(5), [1,0,0]);
  t.deepEqual(zipP3, [ 3, 3, 4 ], "zipWith +_3");

  t.deepEqual($.iterate(8, 2, $.times(2)), [ 2, 4, 8, 16, 32, 64, 128, 256 ], "Powers of two");

  // Pascal's Triangle
  var pascalNext = function (row) {
    return $.zipWith($.plus2, row.concat(0), [0].concat(row));
  };
  var pascal = $.iterate(6, [1], pascalNext);
  t.deepEqual(pascal[0], [ 1 ], "pascal[0]");
  t.deepEqual(pascal[1], [ 1, 1 ], "pascal[1]");
  t.deepEqual(pascal[2], [ 1, 2, 1 ], "pascal[2]");
  t.deepEqual(pascal[3], [ 1, 3, 3, 1 ], "pascal[3]");
  t.deepEqual(pascal[4], [ 1, 4, 6, 4, 1 ], "pascal[4]");
  t.deepEqual(pascal[5], [ 1, 5, 10, 10, 5, 1 ], "pascal[5]");
  t.equal(pascal.length, 6, "got exactly the number of rows we asked for in pascal");

  // Prime numbers
  var notCoprime = $.seq($.gcd, $.gt(1));
  var primes = $.nubBy(notCoprime, $.range(2, 20));
  t.deepEqual(primes, [ 2, 3, 5, 7, 11, 13, 17, 19 ], "primes <= 20");

  t.end();
});
