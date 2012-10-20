# Interlude [![Build Status](https://secure.travis-ci.org/clux/interlude.png)](http://travis-ci.org/clux/interlude)
Interlude is ES5 JavaScript with Haskell inspired enhancements.
It's aims to simplify and abstract common patterns by joining
common higher order functions with the ES5 arsenal to allow a
more declarative style with negligible efficiency changes.

It does not simply alias ES5 methods, and it does not touch prototypes.
*It curries*.

## Usage
Attach it to the short variable of choice:

````javascript
var $ = require('interlude');
````

Then spice up your JavaScript with some functional-style programming;

```javascript
[1,3,2,6,5,4].filter($.gt(4));
// [ 6, 5 ]

$.range(5).map($.pow(2));
// [ 1, 4, 9, 16, 25 ]

var nested = [ [1,3,2], [2,2], [1,4,2,3] ];
$.pluck('length', nested);
// [ 3, 2, 4 ]

nested.filter($.all($.eq(2)));
// [ [2, 2] ]

nested.sort($.comparing('length'));
// [ [ 2 ], [ 1, 3, 2 ], [ 1, 4, 2, 3 ] ]

var pairs = [['woo', 3], ['wee', 1], ['boo', 2]];
pairs.sort($.comparing(1)).map($.first); // [ 'wee', 'boo', 'woo' ]

$.zipWith($.plus3, [1,1,1,1,1], $.range(5), [1,0,0]);
// [ 3, 3, 4 ]

// Powers of two
$.iterate(8, 2, $.times(2));
// [ 2, 4, 8, 16, 32, 64, 128, 256 ]


// Pascal's Triangle
var pascalNext = function (row) {
  return $.zipWith($.plus2, row.concat(0), [0].concat(row));
}
$.iterate(5, [1], pascalNext);
// [ [ 1 ]
//   [ 1, 1 ],
//   [ 1, 2, 1 ],
//   [ 1, 3, 3, 1 ],
//   [ 1, 4, 6, 4, 1 ] ]

// Prime numbers
var notCoprime = $.seq2($.gcd, $.gt(1));
$.nubBy(notCoprime, $.range(2, 20));
// [ 2, 3, 5, 7, 11, 13, 17, 19 ]
````

Interlude consist entirely of re-exported modules structured as follows:

````
interlude
├─── operators
├─── autonomy
├─── subset
└─── wrappers
````

These modules are of course requirable by themselves, and we encourage you to require them directly.The submodules are small (<300 lines each) so by requiring one of them, you are less likely to have to search around to wonder why you included 1000-some lines when you just wanted 2-3 functions.

Minimizing dependencies make it easier for people to reason about your code. That said, this module is here when/if you want it all under the same namespace.

In the mean time, their short and independent API's are available here:

- [operators](https://github.com/clux/operators) ([API](https://github.com/clux/operators/blob/master/api.md))
- [autonomy](https://github.com/clux/autonomy) ([API](https://github.com/clux/autonomy/blob/master/api.md))
- [subset](https://github.com/clux/subset) ([API](https://github.com/clux/subset/blob/master/api.md))
- [wrappers](https://github.com/clux/wrappers) ([API](https://github.com/clux/wrappers/blob/master/api.md))

Additionally, the strict and super-lightweight type testing module [typr](https://github.com/clux/typr) complements this selection of modules nicely.

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