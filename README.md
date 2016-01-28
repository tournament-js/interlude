# Interlude
[![npm status](http://img.shields.io/npm/v/interlude.svg)](https://www.npmjs.org/package/interlude)
[![build status](https://secure.travis-ci.org/clux/interlude.svg)](http://travis-ci.org/clux/interlude)
[![dependency status](https://david-dm.org/clux/interlude.svg)](https://david-dm.org/clux/interlude)
[![coverage status](http://img.shields.io/coveralls/clux/interlude.svg)](https://coveralls.io/r/clux/interlude)

Interlude is a functional ES6 based JavaScript library inspired by Haskell.
It's aims to simplify and abstract common patterns by providing a set of common higher order functions.

## Usage
Use it with qualified imports with the yet unfinished module `import` syntax or attach it to the short variable of choice. For selling points, here's how it will look with ES7 modules.

```js
import { range, pow, times, all, eq, comparing, zipWith, zipWith3, iterate, gcd, uniqueBy, iterate, interval } from 'interlude'

range(5).map(pow(2));
// [ 1, 4, 9, 16, 25 ]

var nested = [ [ 1, 3, 2 ], [ 2, 2 ], [ 1, 4, 2, 3 ] ];
nested.filter(all(eq(2)));
// [ [2, 2] ]

// outer sort by property
nested.sort(comparing('length'));
// [ [ 2, 2 ], [ 1, 3, 2 ], [ 1, 4, 2, 3 ] ]

zipWith3((x, y, z) => x + y + z, [1,1,1,1,1], range(5), [1,0,0]);
// [ 3, 3, 4 ]

// Powers of two
iterate(8, 2, times(2));
// [ 2, 4, 8, 16, 32, 64, 128, 256 ]

// Pascal's Triangle
var pascalNext = (row) => zipWith((x, y) => x + y, row.concat(0), [0].concat(row));

iterate(6, [1], pascalNext);
// [ [ 1 ],
//   [ 1, 1 ],
//   [ 1, 2, 1 ],
//   [ 1, 3, 3, 1 ],
//   [ 1, 4, 6, 4, 1 ],
//   [ 1, 5, 10, 10, 5, 1 ] ]

// Prime numbers
var notCoprime = (x, y) => gcd(x, y) > 1;
uniqueBy(notCoprime, interval(2, 20));
// [ 2, 3, 5, 7, 11, 13, 17, 19 ]
```

Interlude is merely a stable front for three re-exported modules:

```
interlude
├─── autonomy
├─── operators
└─── subset
```

These modules are of course requirable by themselves, and we encourage you to require them directly. The submodules are small (<150 lines each) and focused.

Regardless, you should read their short and independent APIs:

- [autonomy](https://github.com/clux/autonomy) ([API](https://github.com/clux/autonomy/blob/master/api.md))
- [subset](https://github.com/clux/subset) ([API](https://github.com/clux/subset/blob/master/api.md))
- [operators](https://github.com/clux/operators) ([API](https://github.com/clux/operators/blob/master/api.md))

Additionally, two extra modules (which were not included in interlude due to their smaller likelihood of use) are also good fits. They do not overlap in API, and are highly recommended *when needed*. You may wish to read their short APIs as well.

- [wrappers](https://github.com/clux/wrappers) ([API](https://github.com/clux/wrappers/blob/master/api.md))
- [typr](https://github.com/clux/typr) ([API](https://github.com/clux/typr/blob/master/api.md))

## Installation

```sh
$ npm install interlude
```

## License
MIT-Licensed. See LICENSE file for details.
