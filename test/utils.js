var a = require('assert')
  , $ = require('../')
  , t = require('typr');

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

exports['test#curried_binary_ops'] = function () {
  a.equal($.plus(3)(2), 5, "2+3 === 5");
  a.equal($.subtract(3)(5), 2, "5-3 === 2");
  a.equal($.times(2)(3), 6, "2*3 === 6");
  a.equal($.divide(2)(6), 3, "6/2 === 3");
  a.eql($.append([1,2])([3]), [3,1,2], "(++[1, 2]) [3] === [3, 1, 2]");
  a.eql($.prepend([1,2])([3]), [1,2,3], "([1, 2]++) [3] === [1, 2, 3]");
};
