var $ = require('..');

test('readme', function *(t) {
  t.eq($.range(5).map($.pow(2)), [ 1, 4, 9, 16, 25 ], '[1..5] map pow 2');

  var nested = [ [1,3,2], [2,2], [1,4,2,3] ];
  t.eq(nested.filter($.all($.eq(2))), [ [2, 2] ], 'nested filter all eq 2');

  nested.sort($.comparing('length'));
  t.eq(nested, [ [ 2, 2 ], [ 1, 3, 2 ], [ 1, 4, 2, 3 ] ], 'nested sort prop');

  var zipP3 = $.zipWith3($.plus3, [1,1,1,1,1], $.range(5), [1,0,0]);
  t.eq(zipP3, [ 3, 3, 4 ], 'zipWith +3');

  t.eq($.iterate(8, 2, $.times(2)), [ 2, 4, 8, 16, 32, 64, 128, 256 ], 'Powers of two');

  // Pascal's Triangle
  var pascalNext = (row) => $.zipWith((x, y) => x + y, row.concat(0), [0].concat(row));

  var pascal = $.iterate(6, [1], pascalNext);
  t.eq(pascal, [
    [ 1 ],
    [ 1, 1 ],
    [ 1, 2, 1 ],
    [ 1, 3, 3, 1 ],
    [ 1, 4, 6, 4, 1 ],
    [ 1, 5, 10, 10, 5, 1 ] ],
    'pascals triangle rows 1-6'
  );

  // Prime numbers
  var notCoprime = (x, y) => $.gcd(x, y) > 1;
  var primes = $.uniqueBy(notCoprime, $.range(2, 20));
  t.eq(primes, [ 2, 3, 5, 7, 11, 13, 17, 19 ], 'primes <= 20');
});
