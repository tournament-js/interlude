var tap = require('tap')
  , test = tap.test
  , $ = require('../');

test("misc", function (t) {
  // stuff that relies on many modules for consistency with examples
  var notCoprime = $.seq2($.gcd, $.gt(1));
  t.deepEqual($.nubBy(notCoprime, $.range(2, 11)), [2,3,5,7,11], "primes nubBy");
  t.end();
});

