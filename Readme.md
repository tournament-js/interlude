# Interlude ![travis build status](https://secure.travis-ci.org/clux/interlude.png)
The aim of this module (unlike many similar helper libraries) is not: to replace/alias ES5 methods,
stuff Array.prototype full of helper methods, nor try to avoid using JS semantics for another language's.
Instead, it exports higher order additions and curried functions to go with the ES5 arsenal,
to improve the readibility and semantics of common boilerplate code, while maintaining efficiency.

Currently, only a preview version is available on npm, but docs and additions are coming.

## Usage
Attach it to your generic free short variable:

````javascript
var $ = require('interlude');
````

Then add some Functional Programming, JavaScript style;

```javascript
[1,3,2,6,5,4].filter($.gt(4));
// [ 6, 5 ]

$.range(5).map($.pow(2));
// [ 1, 4, 9, 16, 25 ]

var nested = [[1, 3, 2], [2], [1, 4, 2, 3]];
$.collect('length', nested); // alternatively: nested.map($.get('length'));
// [ 3, 1, 4 ]

nested.sort($.comparing('length'));
// [ [ 2 ], [ 1, 3, 2 ], [ 1, 4, 2, 3 ] ]

$.zipWith($.add, [1, 1, 1, 1, 1], $.range(5), [1, 0, 0]);
// [ 3, 3, 4 ]

var f = g = h = $.noop;
$.compose(f, g, h);
// [Function] :: args -> f(g(h(args)))

// Powers of two
$.iterate(8, $.times(2))(2);
// [ 2, 4, 8, 16, 32, 64, 128, 256 ]


// Pascal's Triangle
var pascalNext = function (row) {
  return $.zipWith($.add2, row.concat(0), [0].concat(row));
}
$.iterate(5, pascalNext)([1]);
// [ [ 1 ],var notCoprime = $.compose($.gt(1), $.gcd);
$.nubBy(notCoprime, $.range(2, 20));
//   [ 1, 1 ],
//   [ 1, 2, 1 ],
//   [ 1, 3, 3, 1 ],
//   [ 1, 4, 6, 4, 1 ] ]


// Fibonacci numbers
var fibPairs = $.iterate(8, function (x) {
  return [x[1], x[0] + x[1]];
})([0,1]);
$.collect(0, fibPairs);
// [ 0, 1, 1, 2, 3, 5, 8, 13 ]


// Prime numbers
var notCoprime = $.compose($.gt(1), $.gcd);
$.nubBy(notCoprime, $.range(2, 20));
// [ 2, 3, 5, 7, 11, 13, 17, 19 ]
````

Read the API (TODO)

## Installation

````bash
$ npm install interlude
````

## Running tests
Install development dependencies

````bash
$ npm install
````

Run the tests

````bash
$ npm test
````

## License
MIT-Licensed. See LICENSE file for details.
